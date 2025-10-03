<?php

namespace App\Filament\Pages;

use Filament\Actions\Action;
use Filament\Forms\Components\{ColorPicker, FileUpload, Group, Repeater, Section, Textarea, TextInput};
use Filament\Forms\Form;
use Filament\Pages\Page;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use TomatoPHP\FilamentIcons\Components\IconPicker;

class LandingFormPage extends Page implements HasForms
{
    use InteractsWithForms;

    public ?array $data = [];

    protected static ?string $navigationGroup = 'CMS';
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Landing Page';
    protected static ?int $navigationSort = 3;
    public static bool $shouldRegisterNavigation = true;

    protected static string $view = 'filament.pages.landing-form-page';

    public function mount(): void
    {
        $this->form->fill(); // preload here if you store settings
    }

    /* -----------------------------------------------------------------
    |  Form
    | ----------------------------------------------------------------- */
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                $this->heroSection(),
                $this->servicesSection(),
                $this->productsSection(),
            ])
            ->statePath('data');
    }

    /* -----------------------------------------------------------------
    |  Sections
    | ----------------------------------------------------------------- */
    protected function heroSection(): Section
    {
        return Section::make('Hero Section')
            ->collapsible()
            ->schema([
                Group::make([
                    TextInput::make('hero_title')
                        ->label('Title')
                        ->required()
                        ->maxLength(120)
                        ->helperText('Big heading shown to visitors.'),

                    Textarea::make('hero_description')
                        ->label('Subtitle')
                        ->required()
                        ->rows(1)
                        ->maxLength(280),

                    FileUpload::make('hero_image')
                        ->label('Image')
                        ->image()
                        ->maxSize(2048)
                        ->acceptedFileTypes(['image/jpeg', 'image/png'])
                        ->directory('landing/hero')
                        ->preserveFilenames()
                        ->columnSpanFull(),
                ])->columns(2),

                Repeater::make('hero_features')
                    ->label('Main Features')
                    ->minItems(1)
                    ->maxItems(6)
                    ->columns(3)
                    ->schema([
                        IconPicker::make('icon')->required()->columnSpan(1),
                        TextInput::make('label')
                            ->required()
                            ->placeholder('Feature text')
                            ->columnSpan(2),
                    ])
                    ->addActionLabel('Add feature'),
            ]);
    }

    protected function servicesSection(): Section
    {
        return Section::make('Services Section')
            ->collapsible()
            ->schema([
                TextInput::make('services_title')
                    ->label('Section Title')
                    ->required()
                    ->maxLength(120),

                Textarea::make('services_description')
                    ->label('Section Description')
                    ->required()
                    ->rows(3)
                    ->maxLength(280),

                Repeater::make('services_items')
                    ->label('Service Items')
                    ->minItems(1)
                    ->schema([
                        Group::make([
                            TextInput::make('title')
                                ->required()
                                ->maxLength(80),
                            ColorPicker::make('color')->default('#3b82f6'),
                        ])->columns(2),

                        Textarea::make('description')
                            ->required()
                            ->rows(2)
                            ->maxLength(300),
                    ])
                    ->addActionLabel('Add service'),
            ]);
    }

    protected function productsSection(): Section
    {
        return Section::make('Products Section')
            ->collapsible()
            ->schema([
                TextInput::make('products_title')
                    ->label('Section Title')
                    ->required()
                    ->maxLength(120),

                Textarea::make('products_description')
                    ->label('Section Description')
                    ->required()
                    ->rows(3)
                    ->maxLength(280),
            ]);
    }

    /* -----------------------------------------------------------------
    |  Save
    | ----------------------------------------------------------------- */
    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('filament-panels::resources/pages/edit-record.form.actions.save.label'))
                ->submit('save'),
        ];
    }

    public function save(): void
    {
        // TODO: store $this->data in DB / cache / settings table
        // Settings::set('landing_page', $this->data);

        Notification::make()
            ->title('Landing page saved')
            ->success()
            ->send();
    }
}