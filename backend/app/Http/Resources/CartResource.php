<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
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
            'quantity' => $this->quantity,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'slug' => $this->product->slug,
                    'price' => $this->product->price,
                    'image_url' => $this->product->image_url,
                    'category' => $this->when(
                        $this->product->relationLoaded('category'),
                        function () {
                            return [
                                'id' => $this->product->category->id,
                                'name' => $this->product->category->name,
                                'slug' => $this->product->category->slug,
                            ];
                        }
                    ),
                ];
            }),
            'total_price' => $this->when(
                $this->relationLoaded('product'),
                $this->quantity * $this->product->price
            ),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}