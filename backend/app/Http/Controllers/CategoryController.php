<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Resources\CategoryResource;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $categories = Category::withCount('products')
            ->paginate($perPage, ['*'], 'page', $currentPage);

        $resource = CategoryResource::collection($categories);

        return $this->paginatedResponse($resource, 'Categories retrieved successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $category = Category::create($validated);

        return $this->successResponse(
            new CategoryResource($category),
            'Category created successfully.',
            Response::HTTP_CREATED
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): JsonResponse
    {
        $category->loadCount('products');

        return $this->successResponse(
            new CategoryResource($category),
            'Category retrieved successfully.'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $validated = $request->validated();

        $category->update($validated);

        return $this->successResponse(
            new CategoryResource($category),
            'Category updated successfully.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): JsonResponse
    {
        // Check if category has products
        if ($category->products()->exists()) {
            return $this->errorResponse(
                'Cannot delete category with associated products.',
                Response::HTTP_CONFLICT
            );
        }

        $category->delete();

        return $this->successResponse(
            null,
            'Category deleted successfully.'
        );
    }

    /**
     * Admin: Display a listing of all categories with additional details.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $categories = Category::withCount('products')
            ->paginate($perPage, ['*'], 'page', $currentPage);

        $resource = CategoryResource::collection($categories);

        return $this->paginatedResponse($resource, 'Categories retrieved successfully.');
    }

    /**
     * Admin: Display the specified category with additional details.
     */
    public function adminShow(Category $category): JsonResponse
    {
        $category->loadCount('products');

        return $this->successResponse(
            new CategoryResource($category),
            'Category retrieved successfully.'
        );
    }
}
