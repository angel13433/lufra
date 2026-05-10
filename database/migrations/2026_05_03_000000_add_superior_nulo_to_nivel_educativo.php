<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::table('nivel_educativo')->insertOrIgnore([
            ['Nombre_Nivel' => 'Superior'],
            ['Nombre_Nivel' => 'Nulo'],
        ]);
    }

    public function down()
    {
        DB::table('nivel_educativo')->whereIn('Nombre_Nivel', ['Superior', 'Nulo'])->delete();
    }
};
