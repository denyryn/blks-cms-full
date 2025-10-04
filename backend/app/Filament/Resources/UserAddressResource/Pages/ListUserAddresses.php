<?php

namespace App\Filament\Resources\UserAddressResource\Pages;

use Filament\Actions\CreateAction;
use App\Filament\Resources\UserAddressResource;
use Filament\Pages\Actions;
use Filament\Resources\Pages\ListRecords;

class ListUserAddresses extends ListRecords
{
    protected static string $resource = UserAddressResource::class;

    protected function getActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
