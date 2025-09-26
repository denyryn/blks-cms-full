<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->word();
        return [
            'category_id' => $this->faker->numberBetween(1, 10),
            'name' => $name,
            'slug' => \Str::slug($name),
            'description' => $this->faker->sentence(),
            'image_url' => null,
            'price' => $this->faker->randomFloat(2, 1, 100),
        ];
    }
}
