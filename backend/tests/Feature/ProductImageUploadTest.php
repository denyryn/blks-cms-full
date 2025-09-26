<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductImageUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test admin user
        $this->adminUser = User::factory()->create(['role' => 'admin']);

        // Create test category
        $this->category = Category::factory()->create();

        // Fake storage for testing
        Storage::fake('public');
    }

    public function test_admin_can_create_product_with_image()
    {
        // Create a fake image file
        $image = UploadedFile::fake()->image('product.jpg', 800, 600)->size(1024); // 1MB

        $productData = [
            'name' => 'Test Product with Image',
            'description' => 'Test product description',
            'price' => 99.99,
            'category_id' => $this->category->id,
            'image' => $image,
        ];

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/products', $productData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'code',
                'status',
                'message',
                'data' => [
                    'id',
                    'name',
                    'description',
                    'price',
                    'image_url',
                    'category_id',
                ]
            ]);

        // Verify the product was created
        $this->assertDatabaseHas('products', [
            'name' => 'Test Product with Image',
            'price' => 99.99,
        ]);

        // Verify image was stored
        $product = Product::where('name', 'Test Product with Image')->first();
        $this->assertNotNull($product->image_url);
        $this->assertStringContainsString('/storage/products/', $product->image_url);

        // Since we're using Storage::fake(), we can check if the file was stored
        $imagePath = str_replace('/storage/', '', $product->image_url);
        $this->assertTrue(Storage::disk('public')->exists($imagePath));
    }

    public function test_admin_can_update_product_image()
    {
        // Create a product first
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
            'image_url' => '/storage/products/old-image.jpg'
        ]);

        // Create old image file in storage
        Storage::disk('public')->put('products/old-image.jpg', 'old image content');

        // Create new image
        $newImage = UploadedFile::fake()->image('new-product.png', 600, 400)->size(512); // 512KB

        $updateData = [
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'category_id' => $product->category_id,
            'image' => $newImage,
        ];

        $response = $this->actingAs($this->adminUser)
            ->putJson("/api/admin/products/{$product->id}", $updateData);

        $response->assertStatus(200);

        // Verify the product was updated
        $product->refresh();
        $this->assertNotEquals('/storage/products/old-image.jpg', $product->image_url);
        $this->assertStringContainsString('/storage/products/', $product->image_url);

        // Verify old image was deleted and new image exists
        $this->assertFalse(Storage::disk('public')->exists('products/old-image.jpg'));

        $newImagePath = str_replace('/storage/', '', $product->image_url);
        $this->assertTrue(Storage::disk('public')->exists($newImagePath));
    }

    public function test_image_validation_rejects_large_files()
    {
        // Create image larger than 10MB
        $largeImage = UploadedFile::fake()->image('large.jpg')->size(11 * 1024); // 11MB

        $productData = [
            'name' => 'Test Product',
            'price' => 99.99,
            'category_id' => $this->category->id,
            'image' => $largeImage,
        ];

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/products', $productData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image']);
    }

    public function test_image_validation_rejects_non_image_files()
    {
        // Create a non-image file
        $textFile = UploadedFile::fake()->create('document.txt', 100);

        $productData = [
            'name' => 'Test Product',
            'price' => 99.99,
            'category_id' => $this->category->id,
            'image' => $textFile,
        ];

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/admin/products', $productData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image']);
    }

    public function test_product_deletion_removes_image_file()
    {
        // Create a product with an image
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
            'image_url' => '/storage/products/test-image.jpg'
        ]);

        // Create the image file in storage
        Storage::disk('public')->put('products/test-image.jpg', 'test image content');

        // Delete the product
        $response = $this->actingAs($this->adminUser)
            ->deleteJson("/api/admin/products/{$product->id}");

        $response->assertStatus(200);

        // Verify product was deleted
        $this->assertDatabaseMissing('products', ['id' => $product->id]);

        // Verify image file was deleted
        $this->assertFalse(Storage::disk('public')->exists('products/test-image.jpg'));
    }

    private User $adminUser;
    private Category $category;
}