<?php

namespace App\Filament\Components;

use Filament\Forms\Components\ColorPicker;
use Guava\FilamentIconPicker\Forms\IconPicker;

class GlobalFormComponents
{
    /**
     * Return a preconfigured ColorPicker used across Filament forms.
     *
     * @param string $name
     * @return \Filament\Forms\Components\ColorPicker
     */
    public static function color(string $name): ColorPicker
    {
        return ColorPicker::make($name)
            ->default('#3b82f6');
    }

    /**
     * Return a preconfigured IconPicker used across Filament forms.
     *
     * @param string $name
     * @return \Guava\FilamentIconPicker\Forms\IconPicker
     */
    public static function icon(string $name): IconPicker
    {
        return IconPicker::make($name)
            ->sets(['lucide'])
            ->columns(3);
    }
}
