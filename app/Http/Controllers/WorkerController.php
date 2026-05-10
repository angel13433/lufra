<?php

namespace App\Http\Controllers;

use App\Models\Trabajador;
use App\Models\Vacacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class WorkerController extends Controller
{
    public function getProfile()
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'No hay un trabajador vinculado a este usuario.'], 404);
        }

        $trabajador = DB::table('trabajador as w')
            ->leftJoin('cargo as c', 'w.Id_Cargo', '=', 'c.Id_Cargo')
            ->select('w.*', 'c.Nombre_profesión as Cargo')
            ->where('w.Id_Trabajador', $user->Id_Trabajador)
            ->first();

        if (!$trabajador) {
            return response()->json(['error' => 'No se encontró la información del trabajador.'], 404);
        }

        return response()->json($trabajador);
    }

    public function getVacations()
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        $trabajador = Trabajador::find($user->Id_Trabajador);
        $lastRequest = Vacacion::where('Id_Trabajador', $user->Id_Trabajador)
            ->orderBy('Id_Solicitud', 'desc')
            ->first();

        return response()->json([
            'fechaIngreso' => $trabajador->Fecha_de_Ingreso,
            'lastRequest' => $lastRequest,
        ]);
    }

    public function storeVacationRequest(Request $request)
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        $request->validate([
            'startDate' => 'required|date|after:today',
        ]);

        $vacacion = Vacacion::create([
            'Id_Trabajador' => $user->Id_Trabajador,
            'Fecha_Solicitud' => now()->toDateString(),
            'Fecha_Inicio_Vacaciones' => $request->startDate,
            'Estado' => 'Pendiente',
        ]);

        return response()->json(['success' => true, 'id' => $vacacion->Id_Solicitud]);
    }

    public function getPayslips()
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            return response()->json(['error' => 'Trabajador no identificado.'], 404);
        }

        $trabajador = Trabajador::find($user->Id_Trabajador);
        $cedula = $trabajador->Documento_Identidad;

        $payslips = DB::table('payslips')
            ->where('Id_Trabajador', $user->Id_Trabajador)
            ->orWhere('Data', 'like', '%"cedula":"' . $cedula . '"%')
            ->orderBy('Fecha_Pago', 'desc')
            ->get();

        // Parse JSON data
        $formattedPayslips = $payslips->map(function ($p) {
            $data = json_decode($p->Data);
            return [
                'id' => $p->Id_Payslip,
                'fechaPago' => $p->Fecha_Pago,
                'periodo' => $data->periodo ?? '-',
                'neto' => $p->Neto,
            ];
        });

        return response()->json($formattedPayslips);
    }

    public function showPayslip($id)
    {
        $user = Auth::user();
        if (!$user->Id_Trabajador) {
            abort(404, 'Trabajador no identificado.');
        }

        $payslip = DB::table('payslips')
            ->where('Id_Payslip', $id)
            ->first();

        if (!$payslip) {
            abort(404, 'Recibo no encontrado.');
        }

        // Decode JSON extended data
        $data = json_decode($payslip->Data, true);

        // Access checks (Ensure worker only views their own by validating DB id or JSON cedula)
        $trabajador = Trabajador::find($user->Id_Trabajador);
        if ($payslip->Id_Trabajador != $user->Id_Trabajador && (!isset($data['cedula']) || $data['cedula'] !== $trabajador->Documento_Identidad)) {
            abort(403, 'Acceso denegado a este recibo.');
        }

        $fechaPago = $payslip->Fecha_Pago;
        $salarioBase = $payslip->Salario_Base ?? 0;
        $neto = $payslip->Neto;

        $trabajadorInfo = $data['trabajador'] ?? 'N/A';
        $cedula = $data['cedula'] ?? 'N/A';
        $periodo = $data['periodo'] ?? 'N/A';
        $fechaInicio = $data['fechaInicio'] ?? '';
        $fechaFin = $data['fechaFin'] ?? '';
        $conceptos = $data['conceptos'] ?? [];
        $numeroRecibo = $data['numeroRecibo'] ?? str_pad($id, 10, '0', STR_PAD_LEFT);

        $totalAsig = 0;
        $totalDeduc = 0;

        $hasSueldo = false;
        foreach($conceptos as $c) {
            $desc = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '');
            if (stripos($desc, 'Sueldo') !== false || stripos($desc, 'Salario') !== false || stripos($desc, 'Dias Laborables') !== false) {
                $hasSueldo = true; break;
            }
        }

        $computedConceptos = $conceptos;

        if (!$hasSueldo && $salarioBase > 0) {
            $computedConceptos[] = [
                'codigo' => '001',
                'Nombre_Concepto' => 'Sueldo Mensual',
                'Tipo' => 'Asignación',
                'Monto' => $salarioBase,
                'aux' => '30 Días'
            ];
        }

        $hasSSO = false; $hasRPE = false; $hasFAOV = false;
        foreach($conceptos as $c) {
            $desc = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '');
            $codigoC = $c['Codigo'] ?? ($c['codigo'] ?? '');
            
            if (stripos($desc, 'SSO') !== false || stripos($desc, 'Seguro Social') !== false || $codigoC === 'IVSS') $hasSSO = true;
            if (stripos($desc, 'RPE') !== false || stripos($desc, 'Desempleo') !== false || $codigoC === 'SPF') $hasRPE = true;
            if (stripos($desc, 'FAOV') !== false || stripos($desc, 'Vivienda') !== false || $codigoC === 'FAOV') $hasFAOV = true;
        }

        $totalIngresos = 0;
        foreach($computedConceptos as $c) {
            $nombreC = $c['Nombre_Concepto'] ?? ($c['nombre'] ?? '');
            $tipoC = $c['Tipo'] ?? '';
            $auxC = $c['aux'] ?? '';
            $unidC = $this->extractNumeric($auxC);
            $montoC = ($c['Monto'] ?? ($c['asignacion'] ?? ($c['monto'] ?? 0)));

            // Basic check for daily concepts if Monto is 0 but it's a known daily type
            if ($montoC <= 0) {
                $kwD = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'sueldo', 'salario', 'descanso', 'vacaciones'];
                foreach($kwD as $kw) {
                    if (stripos($nombreC, $kw) !== false) {
                        $montoC = $salarioBase / 30;
                        break;
                    }
                }
            }

            if ($tipoC === 'Asignación' || $tipoC === 'Bonificación' || stripos($nombreC, 'Sueldo') !== false || stripos($nombreC, 'Asignación') !== false) {
                $totalIngresos += ($montoC * $unidC);
            }
        }

        // Per user request, base for retentions should be total income (assignments)
        // If it's a quincena (standard), we multiply by 2 for the monthly cap check.
        // We set it to 0 if no assignments are present to avoid auto-calculating on base salary.
        $baseCalculo = ($totalIngresos > 0) ? ($totalIngresos * 2) : 0; 


        if ($baseCalculo > 0) {
            $topeMensual = 130.00 * 5; // SALARIO_MINIMO_LEGAL = 130
            $baseDeduccion = min($baseCalculo, $topeMensual); 
            $sueldoSemanal = ($baseDeduccion * 12) / 52;

            // countMondays logic
            $lunesMes = 4;
            if ($fechaInicio && $fechaFin) {
                try {
                    $start = new \DateTime($fechaInicio);
                    $end = new \DateTime($fechaFin);
                    $lunesMes = 0;
                    while ($start <= $end) {
                        if ($start->format('N') == 1) $lunesMes++;
                        $start->modify('+1 day');
                    }
                    if ($lunesMes == 0) $lunesMes = 2;
                } catch (\Exception $e) {}
            }

            if (!$hasSSO) {
                $montoSSO = $sueldoSemanal * 0.04 * $lunesMes;
                $computedConceptos[] = ['Codigo' => 'IVSS', 'Nombre_Concepto' => 'Seguro Social Obligatorio (4%)', 'Tipo' => 'Deducción', 'Monto' => $montoSSO, 'aux' => $lunesMes . ' Lunes'];
            }
            if (!$hasRPE) {
                $montoRPE = $sueldoSemanal * 0.005 * $lunesMes;
                $computedConceptos[] = ['Codigo' => 'SPF', 'Nombre_Concepto' => 'Régimen Prest. de Empleo (0.5%)', 'Tipo' => 'Deducción', 'Monto' => $montoRPE, 'aux' => $lunesMes . ' Lunes'];
            }
            if (!$hasFAOV) {
                $montoFAOV = $totalIngresos * 0.01;
                $computedConceptos[] = ['Codigo' => 'FAOV', 'Nombre_Concepto' => 'Ahorro Habitacional (1%)', 'Tipo' => 'Deducción', 'Monto' => $montoFAOV, 'aux' => '1%'];
            }
        }

        $finalConceptos = [];
        $totalAsig = 0;
        $totalDeduc = 0;

        foreach ($computedConceptos as $c) {
            $nombre = $c['Nombre_Concepto'] ?? ($c['descripcion'] ?? '---');
            $codigo = $c['Codigo'] ?? ($c['codigo'] ?? ($c['Id_Concepto'] ?? '---'));
            $tipo = $c['Tipo'] ?? '';
            $aux = $c['aux'] ?? '';
            $unidades = $this->extractNumeric($aux);
            $montoUnitario = $c['Monto'] ?? ($c['asignacion'] ?? ($c['deduccion'] ?? 0));

            $isDailyBased = false;
            $keywordsDiarios = ['dias laborables', 'días laborables', 'dias no laborados', 'días no laborados', 'faltas', 'inasistencias', 'vacaciones', 'bono vacacional', 'permiso no remunerado', 'utilidades', 'bono de produccion', 'bono de asistencia', 'sueldo', 'salario', 'dias de descanso', 'días de descanso', 'dia de descanso', 'día de descanso', 'descanso', 'descansos'];
            
            foreach($keywordsDiarios as $kw) {
                if (stripos($nombre, $kw) !== false) {
                    $isDailyBased = true;
                    break;
                }
            }
            if ($isDailyBased) {
                $montoUnitario = $salarioBase / 30;
            }

            $monto = floatval($montoUnitario) * $unidades;

            $asig = ($tipo === 'Asignación' || $tipo === 'Bonificación') ? $monto : 0;
            $deduc = ($tipo === 'Deducción') ? $monto : 0;

            if (!$tipo) {
                $asig = ($c['asignacion'] ?? 0) * $unidades;
                $deduc = ($c['deduccion'] ?? 0) * $unidades;
            }

            $totalAsig += $asig;
            $totalDeduc += $deduc;

            $finalConceptos[] = [
                'codigo' => $codigo,
                'nombre' => $nombre,
                'aux' => $aux,
                'asignacion' => $asig > 0 ? $this->formatCurrency($asig) : '',
                'deduccion' => $deduc > 0 ? $this->formatCurrency($deduc) : ''
            ];
        }

        return view('trabajador.payslip', [
            'fechaPago' => $this->formatDate($fechaPago),
            'numeroRecibo' => $numeroRecibo,
            'trabajador' => $trabajadorInfo,
            'fechaInicio' => $this->formatDate($fechaInicio),
            'cedula' => $cedula,
            'fechaFin' => $this->formatDate($fechaFin),
            'salarioBase' => $this->formatCurrency($salarioBase),
            'periodo' => is_numeric($periodo) ? "Quincena " . $periodo : $periodo,
            'conceptos' => $finalConceptos,
            'totalAsig' => $this->formatCurrency($totalAsig),
            'totalDeduc' => $this->formatCurrency($totalDeduc),
            'netoPago' => $this->formatCurrency($totalAsig - $totalDeduc)
        ]);
    }

    private function formatCurrency($amount) {
        return number_format($amount, 2, ',', '.');
    }

    private function formatDate($date) {
        if (!$date) return 'N/A';
        return date('d/m/Y', strtotime($date));
    }

    private function extractNumeric($str) {
        if (!$str) return 1.0;
        if (preg_match('/(\d+(\.\d+)?)/', $str, $matches)) {
            return floatval($matches[0]);
        }
        return 1.0;
    }
}
