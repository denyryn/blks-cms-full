<?php

namespace App\Filament\Pages;

use Filament\Schemas\Schema;
use Storage;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;
use App\Models\Content;
use Filament\Actions\Action;
use Filament\Forms\Components\{ColorPicker, FileUpload, Group, Repeater, Section, Textarea, TextInput};
use Filament\Pages\Page;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Guava\FilamentIconPicker\Forms\IconPicker;

class LandingFormPage extends Page implements HasForms
{
    use InteractsWithForms;

    public ?array $data = [];

    protected static string | \UnitEnum | null $navigationGroup = 'CMS';
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Landing Page';
    protected static ?int $navigationSort = 3;
    public static bool $shouldRegisterNavigation = true;

    protected string $view = 'filament.pages.landing-form-page';

    protected ?string $pageKey = 'landing_page';

    public function mount(): void
    {
        $this->data = Content::getCached($this->pageKey) ?? [];
        $this->form->fill($this->data); // preload here if you store settings
    }

    /* -----------------------------------------------------------------
    |  Form
    | ----------------------------------------------------------------- */
    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                $this->heroSection(),
                $this->servicesSection(),
                $this->productsSection(),
            ])
            ->statePath('data');
    }

    /* -----------------------------------------------------------------
    |  Sections
    | ----------------------------------------------------------------- */
    protected function heroSection(): \Filament\Schemas\Components\Section
    {
        return \Filament\Schemas\Components\Section::make('Hero Section')
            ->collapsible()
            ->schema([
                \Filament\Schemas\Components\Group::make([
                    TextInput::make('hero.title')
                        ->label('Title')
                        ->required()
                        ->maxLength(120)
                        ->helperText('Big heading shown to visitors.'),

                    Textarea::make('hero.description')
                        ->label('Subtitle')
                        ->required()
                        ->rows(1)
                        ->maxLength(280),

                    FileUpload::make('hero.image')
                        ->label('Image')
                        ->image()
                        ->maxSize(1024 * 5) // 5MB
                        ->acceptedFileTypes(['image/jpeg', 'image/png'])
                        ->preserveFilenames()
                        ->multiple(false)
                        ->saveUploadedFileUsing(fn($file) =>
                            $file->store('landing/hero', 'public'))
                        ->deleteUploadedFileUsing(fn($file) =>
                            Storage::disk('public')->delete($file))
                        ->columnSpanFull(),
                ])->columns(2),

                Repeater::make('hero.features')
                    ->label('Main Features')
                    ->minItems(1)
                    ->maxItems(6)
                    ->columns(3)
                    ->schema([
                        IconPicker::make('icon')
                            ->sets(['lucide'])
                            ->required()
                            ->columnSpan(1),
                        TextInput::make('label')
                            ->required()
                            ->placeholder('Feature text')
                            ->columnSpan(2),
                    ])
                    ->addActionLabel('Add feature'),
            ]);
    }

    protected function servicesSection(): \Filament\Schemas\Components\Section
    {
        return \Filament\Schemas\Components\Section::make('Services Section')
            ->collapsible()
            ->schema([
                TextInput::make('services.title')
                    ->label('Section Title')
                    ->required()
                    ->maxLength(120),

                Textarea::make('services.description')
                    ->label('Section Description')
                    ->required()
                    ->rows(3)
                    ->maxLength(280),

                Repeater::make('services.items')
                    ->label('Service Items')
                    ->minItems(1)
                    ->schema([
                        \Filament\Schemas\Components\Group::make([
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

    protected function productsSection(): \Filament\Schemas\Components\Section
    {
        return \Filament\Schemas\Components\Section::make('Products Section')
            ->collapsible()
            ->schema([
                TextInput::make('products.title')
                    ->label('Section Title')
                    ->required()
                    ->maxLength(120),

                Textarea::make('products.description')
                    ->label('Section Description')
                    ->required()
                    ->rows(3)
                    ->maxLength(280),
            ]);
    }

    /* -----------------------------------------------------------------
    |  Save
    | ----------------------------------------------------------------- */
    protected function sanitizeUploads($data)
    {
        foreach ($data as $key => $value) {
            if ($value instanceof TemporaryUploadedFile) {
                // Store and replace with path
                $data[$key] = $value->store('landing/hero', 'public');
            } elseif (is_array($value)) {
                $data[$key] = $this->sanitizeUploads($value); // recursive check
            }
        }
        return $data;
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label(__('filament-panels::resources/pages/edit-record.form.actions.save.label'))
                ->action('save'),
        ];
    }

    public function save(): void
    {
        $this->data = $this->sanitizeUploads($this->data);

        Content::saveAndCache($this->pageKey, $this->data);

        Notification::make()
            ->title('Landing page saved successfully')
            ->success()
            ->send();
    }
}