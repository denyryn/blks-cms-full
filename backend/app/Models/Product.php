<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'image_url',
        'price',
        'category_id',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (Product $product) {
            $slug = \Str::slug($product->name);
            $count = static::where('slug', 'like', "{$slug}%")
                ->where('id', '!=', $product->id)
                ->count();

            $product->slug = $count ? "{$slug}-{$count}" : $slug;
        });
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value
            ? asset($value)
            : null
        );
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }
}
