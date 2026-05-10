<?php

namespace App\Http\Controllers;

use App\Models\Cargo;
use App\Models\Concepto;
use App\Models\TipoNomina;
use App\Models\Trabajador;
use App\Models\Vacacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    // --- Trabajadores ---

    public function listWorkers()
    {
        // En un sistema real, usaríamos relaciones de Eloquent configuradas
        // Para esta migración, usaremos un join simple para replicar la vista legacy
        $workers = DB::table('trabajador as w')
            ->leftJoin('cargo as c', 'w.Id_Cargo', '=', 'c.Id_Cargo')
            ->leftJoin('nivel_educativo as n', 'w.Id_Nivel_Educativo', '=', 'n.Id_Nivel_Educativo')
            ->leftJoin('contrato_trabajadores as ct', 'w.Id_Trabajador', '=', 'ct.Id_Trabajador')
            ->leftJoin('tipo_nomina as tn', 'ct.Id_Tipo_Nomina', '=', 'tn.Id_Tipo_Nomina')
            ->select(
                'w.*',
                'c.Nombre_profesión as Cargo',
                'n.Nombre_Nivel as Nivel_Educativo',
                'ct.Id_Tipo_Nomina as Id_Tipo_Nomina',
                'ct.Observaciones as Observaciones',
                'tn.Frecuencia',
                'ct.Estado as Contrato_Estado'
            )
            ->get();

        return response()->json(['workers' => $workers]);
    }

    public function storeWorker(Request $request)
    {
        $data = $request->validate([
            'Nombre_Completo' => 'required|string|max:100',
            'Apellidos' => 'required|string|max:100',
            'Documento_Identidad' => ['required', 'string', 'unique:trabajador,Documento_Identidad', 'regex:/^[VEPGJ]-[0-9]{7,8}$/'],
            'Id_Cargo' => 'required|integer',
            'Id_Nivel_Educativo' => 'required|integer',
            'Id_Tipo_Nomina' => 'required|integer',
            'Fecha_de_Ingreso' => 'required|date|before_or_equal:today',
            'Genero' => 'nullable|string|max:1',
            'Fecha_Nacimiento' => 'nullable|date|before:-18 years',
            'Correo' => ['nullable', 'string', 'email:rfc', 'regex:/^.+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com|live\.com)$/i'],
            'Telefono_Movil' => ['nullable', 'string', 'regex:/^([0-9]{4}-)?[0-9]{7}$/'],
            'Direccion' => 'nullable|string|max:255',
            'Estado_Civil' => 'nullable|string',
            'Observaciones' => 'nullable|string',
            'Estado' => 'nullable|string'
        ], [
            'Documento_Identidad.regex' => 'La cédula debe tener el formato V-12345678 (7 a 8 dígitos).',
            'Telefono_Movil.regex' => 'El teléfono debe tener 7 dígitos después del prefijo.',
            'Fecha_Nacimiento.before' => 'El trabajador debe ser mayor de 18 años.',
            'Fecha_de_Ingreso.before_or_equal' => 'La fecha de ingreso no puede ser futura.',
            'Correo.regex' => 'Solo se permiten correos de dominios comunes (Gmail, Hotmail, Outlook, Yahoo, iCloud).',
            'Correo.email' => 'El formato del correo no es válido.'
        ]);

        return DB::transaction(function () use ($data) {
            // 1. Crear trabajador
            $worker = Trabajador::create([
                'Id_Cargo' => $data['Id_Cargo'],
                'Id_Nivel_Educativo' => $data['Id_Nivel_Educativo'],
                'Nombre_Completo' => $data['Nombre_Completo'],
                'Apellidos' => $data['Apellidos'],
                'Fecha_Nacimiento' => $data['Fecha_Nacimiento'],
                'Genero' => $data['Genero'],
                'Documento_Identidad' => $data['Documento_Identidad'],
                'Correo' => $data['Correo'],
                'Telefono_Movil' => $data['Telefono_Movil'],
                'Direccion' => $data['Direccion'],
                'Estado_Civil' => $data['Estado_Civil'],
                'Fecha_de_Ingreso' => $data['Fecha_de_Ingreso'],
            ]);

            // 2. Crear contrato
            DB::table('contrato_trabajadores')->insert([
                'Id_Trabajador' => $worker->Id_Trabajador,
                'Id_Tipo_Nomina' => $data['Id_Tipo_Nomina'],
                'Fecha_registro' => now()->toDateString(),
                'Observaciones' => $data['Observaciones'] ?? '',
                'Estado' => $data['Estado'] ?? 'Activo'
            ]);

            return response()->json(['success' => true, 'id' => $worker->Id_Trabajador]);
        });
    }

    public function updateWorker(Request $request, $id)
    {
        $worker = Trabajador::findOrFail($id);
        
        $data = $request->validate([
            'Nombre_Completo' => 'required|string|max:100',
            'Apellidos' => 'required|string|max:100',
            'Documento_Identidad' => ['required', 'string', 'regex:/^[VEPGJ]-[0-9]{7,8}$/', 'unique:trabajador,Documento_Identidad,'.$id.',Id_Trabajador'],
            'Id_Cargo' => 'required|integer',
            'Id_Nivel_Educativo' => 'required|integer',
            'Id_Tipo_Nomina' => 'required|integer',
            'Fecha_de_Ingreso' => 'required|date|before_or_equal:today',
            'Genero' => 'nullable|string|max:1',
            'Fecha_Nacimiento' => 'nullable|date|before:-18 years',
            'Correo' => ['nullable', 'string', 'email:rfc', 'regex:/^.+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|icloud\.com|live\.com)$/i'],
            'Telefono_Movil' => ['nullable', 'string', 'regex:/^([0-9]{4}-)?[0-9]{7}$/'],
            'Direccion' => 'nullable|string|max:255',
            'Estado_Civil' => 'nullable|string',
            'Observaciones' => 'nullable|string',
            'Estado' => 'nullable|string'
        ], [
            'Documento_Identidad.regex' => 'La cédula debe tener el formato V-12345678 (7 a 8 dígitos).',
            'Telefono_Movil.regex' => 'El teléfono debe tener 7 dígitos después del prefijo.',
            'Fecha_Nacimiento.before' => 'El trabajador debe ser mayor de 18 años.',
            'Fecha_de_Ingreso.before_or_equal' => 'La fecha de ingreso no puede ser futura.',
            'Correo.regex' => 'Solo se permiten correos de dominios comunes (Gmail, Hotmail, Outlook, Yahoo, iCloud).',
            'Correo.email' => 'El formato del correo no es válido.'
        ]);

        return DB::transaction(function () use ($worker, $data, $id) {
            // 1. Actualizar trabajador
            $worker->update([
                'Id_Cargo' => $data['Id_Cargo'],
                'Id_Nivel_Educativo' => $data['Id_Nivel_Educativo'],
                'Nombre_Completo' => $data['Nombre_Completo'],
                'Apellidos' => $data['Apellidos'],
                'Fecha_Nacimiento' => $data['Fecha_Nacimiento'],
                'Genero' => $data['Genero'],
                'Documento_Identidad' => $data['Documento_Identidad'],
                'Correo' => $data['Correo'],
                'Telefono_Movil' => $data['Telefono_Movil'],
                'Direccion' => $data['Direccion'],
                'Estado_Civil' => $data['Estado_Civil'],
                'Fecha_de_Ingreso' => $data['Fecha_de_Ingreso'],
            ]);

            // 2. Actualizar o crear contrato
            DB::table('contrato_trabajadores')
                ->updateOrInsert(
                    ['Id_Trabajador' => $id],
                    [
                        'Id_Tipo_Nomina' => $data['Id_Tipo_Nomina'],
                        'Observaciones' => $data['Observaciones'] ?? '',
                        'Estado' => $data['Estado'] ?? 'Activo'
                    ]
                );

            return response()->json(['success' => true]);
        });
    }

    public function deactivateWorker($id)
    {
        // Actualizamos el estado en contrato_trabajadores que es el que se usa en el listado
        DB::table('contrato_trabajadores')
            ->where('Id_Trabajador', $id)
            ->update(['Estado' => 'Inactivo']);
            
        return response()->json(['success' => true]);
    }

    public function activateWorker($id)
    {
        DB::table('contrato_trabajadores')
            ->where('Id_Trabajador', $id)
            ->update(['Estado' => 'Activo']);
            
        return response()->json(['success' => true]);
    }

    // --- Vacaciones ---

    public function listVacations()
    {
        $requests = DB::table('solicitudes_vacaciones as sv')
            ->join('trabajador as w', 'sv.Id_Trabajador', '=', 'w.Id_Trabajador')
            ->select('sv.*', 'w.Nombre_Completo', 'w.Apellidos', 'w.Documento_Identidad', 'w.Fecha_de_Ingreso')
            ->orderBy('sv.Fecha_Solicitud', 'desc')
            ->orderBy('sv.Id_Solicitud', 'desc')
            ->get();

        return response()->json(['requests' => $requests]);
    }

    public function updateVacationStatus(Request $request, $id)
    {
        $status = $request->input('status');
        if (!in_array($status, ['Aceptada', 'Rechazada', 'Pendiente'])) {
            return response()->json(['error' => 'Estado inválido'], 400);
        }

        $vacation = DB::table('solicitudes_vacaciones')->where('Id_Solicitud', $id)->first();
        if (!$vacation) {
            return response()->json(['error' => 'Solicitud no encontrada'], 404);
        }

        if ($status == 'Pendiente') {
            if (!in_array($vacation->Estado, ['Aceptada', 'Rechazada'])) {
                return response()->json(['error' => 'No se puede revertir una solicitud pendiente'], 400);
            }
            if ($vacation->Fecha_Inicio_Vacaciones <= now()->toDateString()) {
                return response()->json(['error' => 'No se puede revertir una solicitud con fecha de inicio pasada'], 400);
            }
        }

        $reason = $request->input('reason', '');

        DB::table('solicitudes_vacaciones')
            ->where('Id_Solicitud', $id)
            ->update([
                'Estado' => $status,
                'Fecha_Respuesta' => $status != 'Pendiente' ? now()->toDateString() : null,
                'motivo_rechazo' => $status === 'Rechazada' ? $reason : null
            ]);

        return response()->json(['success' => true]);
    }

    // --- Nómina y Conceptos ---

    public function listTypesNomina()
    {
        return response()->json(['tipos' => TipoNomina::all()]);
    }

    public function storeTypeNomina(Request $request)
    {
        $data = $request->validate([
            'Frecuencia' => 'required|string|unique:tipo_nomina,Frecuencia'
        ], [
            'Frecuencia.unique' => 'Ya existe un tipo de nómina con este nombre.'
        ]);

        // Proveer valores por defecto para campos obligatorios en DB tras eliminar vigencia en UI
        $data['Fecha_Inicio'] = '1900-01-01';
        $data['Fecha_Fin'] = '2099-12-31';

        $tipo = TipoNomina::create($data);
        return response()->json(['success' => true, 'id' => $tipo->Id_Tipo_Nomina]);
    }

    public function updateTypeNomina(Request $request, $id)
    {
        $tipo = TipoNomina::findOrFail($id);
        $data = $request->validate([
            'Frecuencia' => 'required|string|unique:tipo_nomina,Frecuencia,' . $id . ',Id_Tipo_Nomina'
        ], [
            'Frecuencia.unique' => 'Ya existe un tipo de nómina con este nombre.'
        ]);
        $tipo->update($data);
        return response()->json(['success' => true]);
    }

    public function toggleTypeNominaStatus($id)
    {
        $tipo = TipoNomina::findOrFail($id);
        $tipo->Estado = ($tipo->Estado === 'Activo') ? 'Inactivo' : 'Activo';
        $tipo->save();
        return response()->json(['success' => true, 'new_status' => $tipo->Estado]);
    }

    public function deleteTypeNomina($id)
    {
        $tipo = TipoNomina::findOrFail($id);
        $tipo->delete();
        return response()->json(['success' => true]);
    }

    public function listConcepts()
    {
        return response()->json(['conceptos' => Concepto::all()]);
    }

    public function storeConcept(Request $request)
    {
        $data = $request->validate([
            'Nombre_Concepto' => 'required|string',
            'Codigo' => 'nullable|string',
            'Descripción' => 'nullable|string',
            'Tipo' => 'nullable|string',
            'Monto' => 'nullable|numeric'
        ]);

        $concepto = Concepto::create($data);
        return response()->json(['success' => true, 'id' => $concepto->Id_Concepto]);
    }

    public function updateConcept(Request $request, $id)
    {
        $concepto = Concepto::findOrFail($id);
        $data = $request->validate([
            'Nombre_Concepto' => 'required|string',
            'Codigo' => 'nullable|string',
            'Tipo' => 'nullable|string',
            'Monto' => 'nullable|numeric',
            'Descripción' => 'nullable|string'
        ]);

        $concepto->update($data);
        return response()->json(['success' => true]);
    }

    public function toggleConceptStatus($id)
    {
        $concepto = Concepto::findOrFail($id);
        $concepto->Estado = ($concepto->Estado === 'Activo') ? 'Inactivo' : 'Activo';
        $concepto->save();
        return response()->json(['success' => true, 'new_status' => $concepto->Estado]);
    }

    public function deleteConcept($id)
    {
        Concepto::destroy($id);
        return response()->json(['success' => true]);
    }

    public function processPayment(Request $request)
    {
        $data = $request->input('data');
        if (!$data) return response()->json(['error' => 'No data provided'], 400);

        // Validaciones de Backend
        $fechaPago = \Carbon\Carbon::parse($data['fechaPago']);
        if ($fechaPago->isFuture()) {
            return response()->json(['error' => 'La fecha de pago no puede ser futura.'], 422);
        }

        $id = DB::table('payslips')->insertGetId([
            'Id_Trabajador' => $data['trabajadorId'],
            'Fecha_Pago' => $data['fechaPago'],
            'Salario_Base' => $data['salarioBase'],
            'Neto' => $data['neto'],
            'Data' => json_encode($data)
        ]);

        return response()->json(['success' => true, 'id' => $id]);
    }

    // --- Cargos y Otros ---

    public function listCargos()
    {
        return response()->json(['cargos' => Cargo::all()]);
    }

    public function storeCargo(Request $request)
    {
        $data = $request->validate([
            'Nombre_profesión' => 'required|string',
            'Area' => 'nullable|string'
        ]);

        $cargo = Cargo::create($data);
        return response()->json(['success' => true, 'id' => $cargo->Id_Cargo]);
    }
    public function updateCargo(Request $request, $id)
    {
        $cargo = Cargo::findOrFail($id);
        $data = $request->validate([
            'Nombre_profesión' => 'required|string',
            'Area' => 'nullable|string'
        ]);
        $cargo->update($data);
        return response()->json(['success' => true]);
    }

    public function toggleCargoStatus($id)
    {
        $cargo = Cargo::findOrFail($id);
        $cargo->Estado = ($cargo->Estado === 'Activo') ? 'Inactivo' : 'Activo';
        $cargo->save();
        return response()->json(['success' => true, 'new_status' => $cargo->Estado]);
    }

    public function listEducationLevels()
    {
        $niveles = DB::table('nivel_educativo')->get();
        return response()->json(['niveles' => $niveles]);
    }
}
