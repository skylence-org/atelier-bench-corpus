<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

/**
 * Socialite coverage: facade-driver resolution + find-or-create login flow.
 * The redirect leg is network-free (builds the provider URL from config);
 * the callback leg needs real provider credentials to execute.
 */
class SocialAuthController extends Controller
{
    public function redirect(string $provider): RedirectResponse
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider): RedirectResponse
    {
        $socialUser = Socialite::driver($provider)->user();

        $user = User::query()->firstOrCreate(
            ['email' => $socialUser->getEmail()],
            ['name' => $socialUser->getName() ?? 'Social user', 'password' => str()->random(32)],
        );

        Auth::login($user, remember: true);

        return redirect()->intended('/admin');
    }
}
