<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CartQuantityRequest extends FormRequest
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
            'amount' => 'sometimes|integer|min:1|max:999',
            'quantity' => 'sometimes|integer|min:0|max:999',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'amount.integer' => 'The amount must be an integer.',
            'amount.min' => 'The amount must be at least 1.',
            'amount.max' => 'The amount may not be greater than 999.',
            'quantity.integer' => 'The quantity must be an integer.',
            'quantity.min' => 'The quantity must be at least 0.',
            'quantity.max' => 'The quantity may not be greater than 999.',
        ];
    }
}