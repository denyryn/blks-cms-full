<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     * @queryParam search string Search term for product name or description
     * @queryParam category_id int Filter by category ID
     * @queryParam sort string Sort products by name (name-asc, name-desc) or price (price-asc, price-desc)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $search = $request->get('search');
        $categoryId = $request->get('category_id');
        $sort = $request->get('sort');

        $query = Product::with('category');

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply category filter
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Apply sorting
        if ($sort) {
            switch ($sort) {
                case 'name-asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name-desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'price-asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('price', 'desc');
                    break;
                default:
                    // Default sorting if invalid sort parameter is provided
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            // Default sorting when no sort parameter is provided
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate($perPage, ['*'], 'page', $currentPage);
        $resource = ProductResource::collection($products);

        return $this->paginatedResponse($resource, 'Products retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image_url'] = Storage::url($imagePath);
        }

        $product = Product::create($validated);
        $product->load('category');

        return $this->successResponse(
            new ProductResource($product),
            'Product created successfully.',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        $product->load('category');

        return $this->successResponse(
            new ProductResource($product),
            'Product retrieved successfully.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($product->image_url) {
                $oldImagePath = str_replace('/storage/', '', $product->image_url);
                Storage::disk('public')->delete($oldImagePath);
            }

            // Store new image
            $imagePath = $request->file('image')->store('products', 'public');
            $validated['image_url'] = Storage::url($imagePath);
        }

        $product->update($validated);
        $product->load('category');

        return $this->successResponse(
            new ProductResource($product),
            'Product updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): JsonResponse
    {
        // Check if product is in any carts or orders
        if ($product->cartItems()->exists() || $product->orderDetails()->exists()) {
            return $this->errorResponse(
                'Cannot delete product that is in carts or orders.',
                Response::HTTP_CONFLICT
            );
        }

        // Delete associated image file
        if ($product->image_url) {
            $imagePath = str_replace('/storage/', '', $product->image_url);
            Storage::disk('public')->delete($imagePath);
        }

        $product->delete();

        return $this->successResponse(
            null,
            'Product deleted successfully.'
        );
    }

    /**
     * Admin: Display a listing of all products with additional filters.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     * @queryParam search string Search term for product name or description
     * @queryParam category_id int Filter by category ID
     * @queryParam sort string Sort products by name (name-asc, name-desc) or price (price-asc, price-desc)
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $search = $request->get('search');
        $categoryId = $request->get('category_id');
        $sort = $request->get('sort');

        $query = Product::with('category');

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply category filter
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Apply sorting
        if ($sort) {
            switch ($sort) {
                case 'name-asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name-desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'price-asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price-desc':
                    $query->orderBy('price', 'desc');
                    break;
                default:
                    // Default sorting if invalid sort parameter is provided
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            // Default sorting when no sort parameter is provided
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate($perPage);
        $resource = ProductResource::collection($products);

        return $this->paginatedResponse($resource, 'Products retrieved successfully.');
    }

    /**
     * Admin: Display the specified product with additional details.
     */
    public function adminShow(Product $product): JsonResponse
    {
        $product->load('category');

        return $this->successResponse(
            new ProductResource($product),
            'Product retrieved successfully.'
        );
    }
}