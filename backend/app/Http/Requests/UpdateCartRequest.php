<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCartRequest extends FormRequest
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
            'product_id' => [
                'sometimes',
                'required',
                'exists:products,id',
                Rule::unique('carts')->where(function ($query) {
                    return $query->where('user_id', $this->user_id ?? $this->route('cart')->user_id)
                        ->where('product_id', $this->product_id);
                })->ignore($this->route('cart')),
            ],
            'quantity' => 'sometimes|required|integer|min:1|max:999',
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
            'product_id.required' => 'The product is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'product_id.unique' => 'This product is already in the cart for this user.',
            'quantity.required' => 'The quantity is required.',
            'quantity.integer' => 'The quantity must be a whole number.',
            'quantity.min' => 'The quantity must be at least 1.',
            'quantity.max' => 'The quantity cannot exceed 999.',
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
            'product_id' => 'product',
        ];
    }
}