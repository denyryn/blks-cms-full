<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Product;
use App\Models\User; 
use App\Models\Order;

class Home extends Page
{
    protected static string $view = 'filament.pages.home'; // Blade file
    protected static ?string $title = 'Dashboard';
    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static ?string $navigationLabel = 'Home';
    protected static ?int $navigationSort = 1;
}
