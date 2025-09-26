<?php

namespace App\Http\Controllers;

use App\Models\GuestMessage;
use App\Http\Requests\StoreGuestMessageRequest;
use App\Http\Requests\UpdateGuestMessageRequest;
use App\Http\Resources\GuestMessageResource;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuestMessageController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of the resource.
     * 
     * @queryParam per_page int Number of items per page (default: 15)
     * @queryParam page int Current page number (default: 1)
     * @queryParam is_read bool Filter by read status
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 15);
        $currentPage = (int) $request->get('page', 1);
        $isRead = $request->get('is_read');

        $query = GuestMessage::orderBy('created_at', 'desc');

        // Apply read status filter
        if ($isRead !== null) {
            $query->where('is_read', (bool) $isRead);
        }

        $messages = $query->paginate($perPage, ['*'], 'page', $currentPage);
        $resource = GuestMessageResource::collection($messages);

        return $this->paginatedResponse(
            $resource,
            'Guest messages retrieved successfully',
            200
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGuestMessageRequest $request): JsonResponse
    {
        $guestMessage = GuestMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'message' => $request->message,
            'is_read' => false
        ]);

        return $this->successResponse(
            new GuestMessageResource($guestMessage),
            'Message sent successfully! We will get back to you soon.',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(GuestMessage $guestMessage): JsonResponse
    {
        return $this->successResponse(
            new GuestMessageResource($guestMessage),
            'Guest message retrieved successfully',
            200
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GuestMessage $guestMessage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGuestMessageRequest $request, GuestMessage $guestMessage): JsonResponse
    {
        $guestMessage->update([
            'is_read' => $request->boolean('is_read', $guestMessage->is_read)
        ]);

        return $this->successResponse(
            new GuestMessageResource($guestMessage),
            'Guest message updated successfully',
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GuestMessage $guestMessage): JsonResponse
    {
        $guestMessage->delete();

        return $this->successResponse(
            null,
            'Guest message deleted successfully',
            200
        );
    }

    /**
     * Get guest messages statistics
     */
    public function statistics(): JsonResponse
    {
        $totalMessages = GuestMessage::count();
        $unreadMessages = GuestMessage::where('is_read', false)->count();
        $readMessages = GuestMessage::where('is_read', true)->count();

        // Recent messages (last 30 days)
        $recentMessages = GuestMessage::where('created_at', '>=', now()->subDays(30))->count();

        // Messages by month (last 6 months)
        $messagesByMonth = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthKey = $date->format('Y-m');
            $monthName = $date->format('F Y');

            $count = GuestMessage::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $messagesByMonth[] = [
                'month' => $monthName,
                'month_key' => $monthKey,
                'count' => $count
            ];
        }

        // Average response time (if messages are being marked as read)
        $averageResponseTimeHours = null;
        $respondedMessages = GuestMessage::where('is_read', true)->get();

        if ($respondedMessages->count() > 0) {
            $totalResponseTime = 0;
            foreach ($respondedMessages as $message) {
                $responseTime = $message->updated_at->diffInHours($message->created_at);
                $totalResponseTime += $responseTime;
            }
            $averageResponseTimeHours = round($totalResponseTime / $respondedMessages->count(), 2);
        }

        $statistics = [
            'total_messages' => $totalMessages,
            'unread_messages' => $unreadMessages,
            'read_messages' => $readMessages,
            'recent_messages' => $recentMessages,
            'response_rate' => $totalMessages > 0 ? round(($readMessages / $totalMessages) * 100, 2) : 0,
            'average_response_time_hours' => $averageResponseTimeHours,
            'messages_by_month' => $messagesByMonth,
            'latest_message' => GuestMessage::latest()->first() ? [
                'id' => GuestMessage::latest()->first()->id,
                'name' => GuestMessage::latest()->first()->name,
                'created_at' => GuestMessage::latest()->first()->created_at,
                'is_read' => GuestMessage::latest()->first()->is_read
            ] : null
        ];

        return $this->successResponse(
            $statistics,
            'Guest message statistics retrieved successfully',
            200
        );
    }
}
