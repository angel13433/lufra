<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Redirección personalizada después del login
        $this->app->singleton(
            \Laravel\Fortify\Contracts\LoginResponse::class,
            \App\Http\Responses\LoginResponse::class
        );
        $this->app->singleton(
            \Laravel\Fortify\Contracts\LogoutResponse::class,
            \App\Http\Responses\LogoutResponse::class
        );

        /**
         * CONFIGURACIÓN DE AUTENTICACIÓN PERSONALIZADA PARA LUFRA2020
         * Aquí mapeamos los campos del formulario con las columnas reales de la DB.
         */
        Fortify::authenticateUsing(function (Request $request) {
            // Buscamos al usuario por su Nombre_usuario o por su Correo
            $user = User::where('Nombre_usuario', $request->username)
                        ->orWhere('Correo', $request->username)
                        ->first();

            // Verificamos que el usuario exista y la Contraseña sea correcta
            if ($user && Hash::check($request->password, $user->Contraseña)) {
                return $user;
            }

            return null;
        });

        $this->app['router']->get('/redirect-after-login', [\App\Http\Controllers\RedirectAfterLoginController::class, '__invoke'])->name('redirect.after.login');
        
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        // Views are handled via manual routes in web.php or standard Blade templates
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });
    }
}