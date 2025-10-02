<x-filament-panels::page>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {{-- Welcome Card --}}
        <div class="col-span-full">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <h2 class="text-2xl font-bold mb-2">Selamat Datang di Dashboard Admin</h2>
                <p class="text-blue-100">Kelola sistem penjualan komponen elektronika dan robotika dengan mudah.</p>
            </div>
        </div>

        {{-- Quick Stats --}}
        <x-filament::section>
            <x-slot name="heading">
                Total Produk
            </x-slot>
            
            <div class="text-center">
                <div class="text-3xl font-bold text-primary-600 mb-2">
                    {{ App\Models\Product::count() }}
                </div>
                <p class="text-sm text-gray-600">Produk Tersedia</p>
            </div>
        </x-filament::section>

        <x-filament::section>
            <x-slot name="heading">
                Total User
            </x-slot>
            
            <div class="text-center">
                <div class="text-3xl font-bold text-green-600 mb-2">
                    {{ App\Models\User::count() }}
                </div>
                <p class="text-sm text-gray-600">User Terdaftar</p>
            </div>
        </x-filament::section>

        <x-filament::section>
            <x-slot name="heading">
                Total Order
            </x-slot>
            
            <div class="text-center">
                <div class="text-3xl font-bold text-yellow-600 mb-2">
                    {{ App\Models\Order::count() }}
                </div>
                <p class="text-sm text-gray-600">Order Masuk</p>
            </div>
        </x-filament::section>

        {{-- Recent Orders --}}
        <div class="col-span-full lg:col-span-2">
            <x-filament::section>
                <x-slot name="heading">
                    Order Terbaru
                </x-slot>
                
                <div class="space-y-3">
                    @forelse(App\Models\Order::with('user')->latest()->take(5)->get() as $order)
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p class="font-medium">{{ $order->user->name }}</p>
                                <p class="text-sm text-gray-600">{{ $order->created_at->format('d M Y H:i') }}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-medium">Rp {{ number_format($order->total_price, 0, ',', '.') }}</p>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                    {{ $order->status === 'paid' ? 'bg-green-100 text-green-800' : 
                                       ($order->status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800') }}">
                                    {{ ucfirst($order->status) }}
                                </span>
                            </div>
                        </div>
                    @empty
                        <p class="text-gray-500 text-center py-4">Belum ada order</p>
                    @endforelse
                </div>
            </x-filament::section>
        </div>

        {{-- Quick Actions --}}
        <div class="lg:col-span-1">
            <x-filament::section>
                <x-slot name="heading">
                    Quick Actions
                </x-slot>
                
                <div class="space-y-3">
                    <a href="{{ route('filament.admin.resources.products.index') }}" 
                       class="block w-full px-4 py-3 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Kelola Produk
                    </a>
                    <a href="{{ route('filament.admin.resources.orders.index') }}" 
                       class="block w-full px-4 py-3 text-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Kelola Order
                    </a>
                    <a href="{{ route('filament.admin.resources.users.index') }}" 
                       class="block w-full px-4 py-3 text-center bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                        Kelola User
                    </a>
                </div>
            </x-filament::section>
        </div>
    </div>
</x-filament-panels::page>
        <p class="text-lg mb-3 leading-relaxed opacity-90 lg:opacity-100">
            Selamat datang di <span class="font-semibold">ProTech.id</span>,
            rumahnya komponen elektronik & sensor robotika. Temukan solusi terbaik
            untuk proyek dan eksperimenmu di sini!
        </p>

        <p class="text-lg mb-6 leading-relaxed opacity-90 lg:opacity-100">
            Mulai dari sensor, modul, hingga kit robot lengkap semuanya tersedia
            di satu tempat!
        </p>

        {{-- Hero Features --}}
        <ul class="mb-8 space-y-3">
            @php
                $servicesList = [
                    ['text' => 'Produk Lengkap', 'icon' => 'heroicon-o-check-circle'],
                    ['text' => 'Pengiriman Cepat', 'icon' => 'heroicon-o-truck'],
                    ['text' => 'Dukungan Teknis', 'icon' => 'heroicon-o-wrench'],
                ];
            @endphp
            @foreach ($servicesList as $item)
                <li class="flex items-center gap-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <x-dynamic-component :component="$item['icon']" class="text-white lg:text-primary w-4 h-4" />
                    </div>
                    <span class="text-base text-white lg:text-foreground">
                        {{ $item['text'] }}
                    </span>
                </li>
            @endforeach
        </ul>

        {{-- CTA Buttons --}}
        <div class="flex gap-4">
            <a href="{{ route('filament.resources.products.index') }}"
               class="inline-flex items-center justify-center px-8 py-6 bg-primary text-white rounded-lg">
                Belanja Sekarang
            </a>
            <a href="{{ route('about') }}"
               class="inline-flex items-center justify-center px-8 py-6 border border-white rounded-lg text-white">
                Tentang Kami
            </a>
        </div>
    </div>
</section>
