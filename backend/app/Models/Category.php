<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
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
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (Category $category) {
            $slug = \Str::slug($category->name);
            $count = static::where('slug', 'like', "{$slug}%")
                ->where('id', '!=', $category->id)
                ->count();

            $category->slug = $count ? "{$slug}-{$count}" : $slug;
        });
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
