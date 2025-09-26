<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'total_price' => $this->total_price,
            'payment_proof' => $this->payment_proof,
            'status' => $this->status,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'shipping_address' => $this->whenLoaded('shippingAddress', function () {
                return new UserAddressResource($this->shippingAddress);
            }),
            'order_details' => $this->whenLoaded('orderDetails', function () {
                return OrderDetailResource::collection($this->orderDetails);
            }),
            'items_count' => $this->when(
                $this->relationLoaded('orderDetails'),
                $this->orderDetails->count()
            ),
            'total_quantity' => $this->when(
                $this->relationLoaded('orderDetails'),
                $this->orderDetails->sum('quantity')
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}