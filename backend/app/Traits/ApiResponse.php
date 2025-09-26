<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    /**
     * Return a success JSON response.
     *
     * @param mixed $data
     * @param string|null $message
     * @param int $code
     * @return JsonResponse
     */
    public function successResponse($data = null, string $message = null, int $code = Response::HTTP_OK): JsonResponse
    {
        $response = [
            'code' => $code,
            'status' => 'success',
            'message' => $message,
        ];

        if (!is_null($data)) {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    /**
     * Return a paginated JSON response.
     *
     * @param \Illuminate\Contracts\Pagination\Paginator $paginator
     * @param string|null $message
     * @param int $code
     * @return JsonResponse
     */
    public function paginatedResponse($resource, string $message = null, int $code = Response::HTTP_OK): JsonResponse
    {
        // Handle resource wrapping
        $paginator = $resource instanceof AnonymousResourceCollection
            ? $resource->resource
            : $resource;

        return response()->json([
            'code' => $code,
            'status' => 'success',
            'message' => $message,
            'data' => $resource instanceof AnonymousResourceCollection ? $resource->collection : $paginator->items(),
            'pagination' => [
                'current_page' => (int) $paginator->currentPage(),
                'from' => (int) $paginator->firstItem(),
                'to' => (int) $paginator->lastItem(),
                'per_page' => (int) $paginator->perPage(),
                'last_page' => (int) $paginator->lastPage(),
                'total' => (int) $paginator->total(),
                'has_more_pages' => (bool) $paginator->hasMorePages(),
            ],
        ], $code);
    }

    /**
     * Return an error JSON response.
     *
     * @param string|null $message
     * @param int $code
     * @param array $errors
     * @return JsonResponse
     */
    public function errorResponse(string $message = null, int $code = Response::HTTP_BAD_REQUEST, array $errors = []): JsonResponse
    {
        return response()->json([
            'code' => $code,
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    /**
     * Return a not found JSON response.
     *
     * @param string|null $message
     * @return JsonResponse
     */
    public function notFoundResponse(string $message = 'Resource not found.'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_NOT_FOUND);
    }

    /**
     * Return an unauthorized JSON response.
     *
     * @param string|null $message
     * @return JsonResponse
     */
    public function unauthorizedResponse(string $message = 'Unauthorized.'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Return a forbidden JSON response.
     *
     * @param string|null $message
     * @return JsonResponse
     */
    public function forbiddenResponse(string $message = 'Forbidden.'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_FORBIDDEN);
    }

    /**
     * Return a validation error JSON response.
     *
     * @param array $errors
     * @param string|null $message
     * @return JsonResponse
     */
    public function validationErrorResponse(array $errors, string $message = 'Validation Failed.'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_UNPROCESSABLE_ENTITY, $errors);
    }
}