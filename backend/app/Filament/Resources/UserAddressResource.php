<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserAddressResource\Pages;
use App\Models\UserAddress;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UserAddressResource extends Resource
{
    protected static ?string $model = UserAddress::class;

    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static ?string $navigationGroup = 'User Management';
    protected static ?string $pluralLabel = 'User Addresses';
    protected static ?string $modelLabel = 'User Address';

    public static function form(Forms\Form $form): Forms\Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required()
                    ->label('User'),

                Forms\Components\TextInput::make('address_line')
                    ->required()
                    ->maxLength(255),

                Forms\Components\TextInput::make('city')
                    ->required()
                    ->maxLength(100),

                Forms\Components\TextInput::make('province')
                    ->required()
                    ->maxLength(100),

                Forms\Components\TextInput::make('postal_code')
                    ->required()
                    ->maxLength(10),

                Forms\Components\TextInput::make('country')
                    ->required()
                    ->maxLength(100),

                Forms\Components\Toggle::make('is_default')
                    ->label('Default Address')
                    ->default(false),
            ]);
    }

    public static function table(Tables\Table $table): Tables\Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')->label('User'),
                Tables\Columns\TextColumn::make('address_line'),
                Tables\Columns\TextColumn::make('city'),
                Tables\Columns\TextColumn::make('province'),
                Tables\Columns\TextColumn::make('postal_code'),
                Tables\Columns\TextColumn::make('country'),
                Tables\Columns\IconColumn::make('is_default')
                    ->boolean()
                    ->label('Default'),
                Tables\Columns\TextColumn::make('created_at')->dateTime(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUserAddresses::route('/'),
            'create' => Pages\CreateUserAddress::route('/create'),
            'edit' => Pages\EditUserAddress::route('/{record}/edit'),
        ];
    }
}
