<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            'shipping_address_id' => 'required|exists:user_addresses,id',
            'total_price' => 'required|numeric|min:0|max:999999.99',
            'payment_proof' => 'nullable|string|max:255',
            'status' => 'required|string|in:pending,paid,shipped,completed,cancelled',
            'order_details' => 'required|array|min:1',
            'order_details.*.product_id' => 'required|exists:products,id',
            'order_details.*.quantity' => 'required|integer|min:1|max:999',
            'order_details.*.price' => 'required|numeric|min:0|max:999999.99',
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
            'order_details.required' => 'Order details are required.',
            'order_details.array' => 'Order details must be an array.',
            'order_details.min' => 'At least one order detail is required.',
            'order_details.*.product_id.required' => 'Each order detail must have a product.',
            'order_details.*.product_id.exists' => 'One or more selected products do not exist.',
            'order_details.*.quantity.required' => 'Each order detail must have a quantity.',
            'order_details.*.quantity.integer' => 'Quantity must be a whole number.',
            'order_details.*.quantity.min' => 'Quantity must be at least 1.',
            'order_details.*.quantity.max' => 'Quantity cannot exceed 999.',
            'order_details.*.price.required' => 'Each order detail must have a price.',
            'order_details.*.price.numeric' => 'Price must be a number.',
            'order_details.*.price.min' => 'Price must be at least 0.',
            'order_details.*.price.max' => 'Price cannot exceed 999,999.99.',
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
            'order_details' => 'order items',
            'order_details.*.product_id' => 'product',
            'order_details.*.quantity' => 'quantity',
            'order_details.*.price' => 'price',
        ];
    }
}