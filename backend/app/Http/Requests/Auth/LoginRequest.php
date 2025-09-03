<?php
// app/Http/Requests/Auth/LoginRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['nullable', 'string', 'email'],
            'phone' => ['nullable', 'string', 'regex:/^01\d{8}$/'],
            'password' => ['required', 'string', 'min:8'],
            'remember' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Format d\'email invalide.',
            'phone.regex' => 'Le numéro doit être composé de 10 chiffres et commencer par 01.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Vérifier qu'au moins email ou téléphone est fourni
            if (empty($this->email) && empty($this->phone)) {
                $validator->errors()->add(
                    'contact',
                    'Veuillez renseigner votre email ou votre numéro de téléphone.'
                );
            }
        });
    }
}