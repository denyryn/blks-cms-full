<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserAddressRequest extends FormRequest
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
            'label' => 'nullable|string|max:100',
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
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
            'label.string' => 'The address label must be a string.',
            'label.max' => 'The address label cannot exceed 100 characters.',
            'recipient_name.required' => 'The recipient name is required.',
            'recipient_name.string' => 'The recipient name must be a string.',
            'recipient_name.max' => 'The recipient name cannot exceed 255 characters.',
            'phone.required' => 'The phone number is required.',
            'phone.string' => 'The phone number must be a string.',
            'phone.max' => 'The phone number cannot exceed 20 characters.',
            'address_line_1.required' => 'The address line 1 is required.',
            'address_line_1.string' => 'The address line 1 must be a string.',
            'address_line_1.max' => 'The address line 1 cannot exceed 255 characters.',
            'address_line_2.string' => 'The address line 2 must be a string.',
            'address_line_2.max' => 'The address line 2 cannot exceed 255 characters.',
            'city.required' => 'The city is required.',
            'city.string' => 'The city must be a string.',
            'city.max' => 'The city cannot exceed 100 characters.',
            'state.required' => 'The state is required.',
            'state.string' => 'The state must be a string.',
            'state.max' => 'The state cannot exceed 100 characters.',
            'postal_code.required' => 'The postal code is required.',
            'postal_code.string' => 'The postal code must be a string.',
            'postal_code.max' => 'The postal code cannot exceed 20 characters.',
            'country.required' => 'The country is required.',
            'country.string' => 'The country must be a string.',
            'country.max' => 'The country cannot exceed 100 characters.',
            'is_default.boolean' => 'The default flag must be true or false.',
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
            'recipient_name' => 'recipient name',
            'address_line_1' => 'address line 1',
            'address_line_2' => 'address line 2',
            'postal_code' => 'postal code',
            'is_default' => 'default address',
        ];
    }
}