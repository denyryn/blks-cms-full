<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
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
            'user_id' => 'sometimes|required|exists:users,id',
            'shipping_address_id' => 'sometimes|required|exists:user_addresses,id',
            'total_price' => 'sometimes|required|numeric|min:0|max:999999.99',
            'payment_proof' => 'nullable|string|max:255',
            'status' => 'sometimes|required|string|in:pending,paid,shipped,completed,cancelled',
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
            'user_id.required' => 'The user is required.',
            'user_id.exists' => 'The selected user does not exist.',
            'shipping_address_id.required' => 'The shipping address is required.',
            'shipping_address_id.exists' => 'The selected shipping address does not exist.',
            'total_price.required' => 'The total price is required.',
            'total_price.numeric' => 'The total price must be a number.',
            'total_price.min' => 'The total price must be at least 0.',
            'total_price.max' => 'The total price cannot exceed 999,999.99.',
            'status.required' => 'The order status is required.',
            'status.in' => 'The order status must be one of: pending, paid, shipped, completed, cancelled.',
            'payment_proof.string' => 'The payment proof must be a string.',
            'payment_proof.max' => 'The payment proof cannot exceed 255 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'user',
            'shipping_address_id' => 'shipping address',
        ];
    }
}