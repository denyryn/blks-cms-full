<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|exists:users,id',
            'user_address_id' => 'required',
            'cart_ids' => 'nullable|array|min:1',
            'cart_ids.*' => 'exists:carts,id',
            'payment_proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'status' => 'nullable|string|in:pending,paid,shipped,completed,cancelled',
            'order_details' => 'required_without:cart_ids|array|min:1',
            'order_details.*.product_id' => 'required_with:order_details|exists:products,id',
            'order_details.*.quantity' => 'required_with:order_details|integer|min:1|max:999',
            'order_details.*.price' => 'required_with:order_details|numeric|min:0|max:999999.99',
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
            'user_address_id.required' => 'The shipping address is required.',
            'user_address_id.exists' => 'The selected shipping address does not exist.',
            'cart_ids.array' => 'Cart IDs must be an array.',
            'cart_ids.min' => 'At least one cart item is required when using cart IDs.',
            'cart_ids.*.exists' => 'One or more cart items do not exist.',
            'status.in' => 'The order status must be one of: pending, paid, shipped, completed, cancelled.',
            'payment_proof.file' => 'The payment proof must be a file.',
            'payment_proof.mimes' => 'The payment proof must be a file of type: jpg, jpeg, png, pdf.',
            'payment_proof.max' => 'The payment proof file size cannot exceed 5MB.',
            'order_details.required_without' => 'Order details are required when cart IDs are not provided.',
            'order_details.array' => 'Order details must be an array.',
            'order_details.min' => 'At least one order detail is required.',
            'order_details.*.product_id.required_with' => 'Each order detail must have a product.',
            'order_details.*.product_id.exists' => 'One or more selected products do not exist.',
            'order_details.*.quantity.required_with' => 'Each order detail must have a quantity.',
            'order_details.*.quantity.integer' => 'Quantity must be a whole number.',
            'order_details.*.quantity.min' => 'Quantity must be at least 1.',
            'order_details.*.quantity.max' => 'Quantity cannot exceed 999.',
            'order_details.*.price.required_with' => 'Each order detail must have a price.',
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
            'user_address_id' => 'shipping address',
            'order_details' => 'order items',
            'order_details.*.product_id' => 'product',
            'order_details.*.quantity' => 'quantity',
            'order_details.*.price' => 'price',
        ];
    }
}