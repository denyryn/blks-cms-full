<?php

namespace App\Filament\Resources;

use Filament\Schemas\Schema;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Actions\ViewAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use App\Filament\Resources\UserAddressResource\Pages\ListUserAddresses;
use App\Filament\Resources\UserAddressResource\Pages\CreateUserAddress;
use App\Filament\Resources\UserAddressResource\Pages\EditUserAddress;
use App\Filament\Resources\UserAddressResource\Pages;
use App\Models\UserAddress;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UserAddressResource extends Resource
{
    protected static ?string $model = UserAddress::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-home';
    protected static string | \UnitEnum | null $navigationGroup = 'User Management';
    protected static ?string $pluralLabel = 'User Addresses';
    protected static ?string $modelLabel = 'User Address';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required()
                    ->label('User'),

                TextInput::make('address_line')
                    ->required()
                    ->maxLength(255),

                TextInput::make('city')
                    ->required()
                    ->maxLength(100),

                TextInput::make('province')
                    ->required()
                    ->maxLength(100),

                TextInput::make('postal_code')
                    ->required()
                    ->maxLength(10),

                TextInput::make('country')
                    ->required()
                    ->maxLength(100),

                Toggle::make('is_default')
                    ->label('Default Address')
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->label('User'),
                TextColumn::make('address_line'),
                TextColumn::make('city'),
                TextColumn::make('province'),
                TextColumn::make('postal_code'),
                TextColumn::make('country'),
                IconColumn::make('is_default')
                    ->boolean()
                    ->label('Default'),
                TextColumn::make('created_at')->dateTime(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUserAddresses::route('/'),
            'create' => CreateUserAddress::route('/create'),
            'edit' => EditUserAddress::route('/{record}/edit'),
        ];
    }
}
