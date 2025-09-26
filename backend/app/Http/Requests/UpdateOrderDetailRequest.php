<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderDetailRequest extends FormRequest
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
            'order_id' => [
                'sometimes',
                'integer',
                Rule::exists('orders', 'id'),
            ],
            'product_id' => [
                'sometimes',
                'integer',
                Rule::exists('products', 'id'),
            ],
            'quantity' => [
                'sometimes',
                'integer',
                'min:1',
                'max:999',
            ],
            'price' => [
                'sometimes',
                'numeric',
                'min:0',
                'max:999999.99',
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'order_id.exists' => 'The selected order does not exist.',
            'product_id.exists' => 'The selected product does not exist.',
            'quantity.min' => 'Quantity must be at least 1.',
            'quantity.max' => 'Quantity cannot exceed 999.',
            'price.min' => 'Price must be greater than or equal to 0.',
            'price.max' => 'Price cannot exceed 999,999.99.',
        ];
    }
}