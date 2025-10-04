<?php

namespace App\Filament\Resources;

use Filament\Schemas\Schema;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\TextColumn;
use Filament\Actions\EditAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\GuestMessageResource\Pages\ListGuestMessages;
use App\Filament\Resources\GuestMessageResource\Pages\CreateGuestMessage;
use App\Filament\Resources\GuestMessageResource\Pages\EditGuestMessage;
use App\Filament\Resources\GuestMessageResource\Pages;
use App\Models\GuestMessage;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class GuestMessageResource extends Resource
{
    protected static ?string $model = GuestMessage::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('email')
                    ->email()
                    ->maxLength(255),
                Textarea::make('message')
                    ->required()
                    ->maxLength(65535),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->sortable(),
                TextColumn::make('name')->sortable()->searchable(),
                TextColumn::make('email')->sortable()->searchable(),
                TextColumn::make('message')->limit(50)->wrap(),
                TextColumn::make('created_at')
                    ->dateTime('d M Y H:i')->sortable(),
                TextColumn::make('updated_at')
                    ->dateTime('d M Y H:i')->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListGuestMessages::route('/'),
            'create' => CreateGuestMessage::route('/create'),
            'edit' => EditGuestMessage::route('/{record}/edit'),
        ];
    }
}
