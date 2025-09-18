<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['nullable', 'string', 'regex:/^01\d{8}$/', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'is_artisan' => ['boolean'],

            // Champs artisan (conditionnels)
            'shop_name' => ['required_if:is_artisan,true', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'identity_document' => [
                'required_if:is_artisan,true',
                'file',
                'mimes:pdf,jpg,jpeg,png',
                'max:5120' // 5MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'Le prénom est requis.',
            'last_name.required' => 'Le nom de famille est requis.',
            'email.email' => 'L\'adresse e-mail doit être une adresse e-mail valide.',
            'phone.regex' => 'Le numéro de téléphone doit commencer par 01 et contenir 8 chiffres.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'shop_name.required_if' => 'Le nom de la boutique est requis si l\'utilisateur est un artisan.',
            'identity_document.required_if' => 'Le document d\'identité est requis si l\'utilisateur est un artisan.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Vérifier qu'au moins email ou téléphone est fourni
            if (empty($this->email) && empty($this->phone)) {
                $validator->errors()->add(
                    'contact',
                    'Veuillez renseigner au moins votre email ou votre numéro de téléphone.'
                );
            }
        });
    }
}
