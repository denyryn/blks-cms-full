<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Include relationships when loaded
            'addresses' => UserAddressResource::collection($this->whenLoaded('addresses')),
            'default_address' => new UserAddressResource($this->whenLoaded('defaultAddress')),
            'orders_count' => $this->when($this->relationLoaded('orders'), function () {
                return $this->orders->count();
            }),
            'cart_items_count' => $this->when($this->relationLoaded('cartItems'), function () {
                return $this->cartItems->count();
            }),
        ];
    }
}
