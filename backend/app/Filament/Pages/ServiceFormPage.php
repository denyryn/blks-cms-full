<?php

namespace App\Filament\Pages;

use App\Models\Content;
use Filament\Actions\Action;
use Filament\Forms\Components\{ColorPicker, FileUpload, Group, Repeater, Section, Textarea, TextInput};
use App\Filament\Components\GlobalFormComponents;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Guava\FilamentIconPicker\Forms\IconPicker;

class ServiceFormPage extends Page implements HasForms
{
    use InteractsWithForms;

    public ?array $data = [];

    protected static ?string $navigationGroup = 'CMS';
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Service Page';
    protected static ?int $navigationSort = 3;
    public static bool $shouldRegisterNavigation = true;

    protected static string $view = 'filament.pages.service-form-page';

    protected ?string $pageKey = 'service_page';

    public function mount(): void
    {
        $this->data = Content::getCached($this->pageKey) ?? [];
        $this->form->fill($this->data); // preload here if you store settings
    }

    /* -----------------------------------------------------------------
    |  Form
    | ----------------------------------------------------------------- */
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                $this->heroSection(),
                $this->whySection(),
                $this->procedureSection(),
                $this->ctaSection()
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
                TextInput::make('hero.title')
                    ->label('Title')
                    ->required()
                    ->maxLength(120)
                    ->helperText('Big heading shown to visitors.'),
                Textarea::make('hero.description')
                    ->label('Description')
                    ->rows(3)
                    ->required()
                    ->maxLength(255)
                    ->helperText('Short description shown to visitors.'),
                Repeater::make('hero.services')
                    ->label('Services')
                    ->grid(2)
                    ->schema([
                        Group::make([
                            GlobalFormComponents::icon('icon')
                                ->label('Icon Picker')
                                ->required()
                                ->helperText('Select an icon for the Service.'),
                            GlobalFormComponents::color('color'),
                        ])->columns(2),
                        TextInput::make('title')
                            ->label('Title')
                            ->required()
                            ->maxLength(50)
                            ->helperText('Service title, e.g., Projects Completed'),
                        TextInput::make('description')
                            ->label('Description')
                            ->required()
                            ->maxLength(100)
                            ->helperText('Short description of the Service.'),
                    ])
                    ->minItems(1)
                    ->maxItems(10)
                    ->columnSpanFull()
                    ->createItemButtonLabel('Add Service'),
            ]);
    }

    protected function whySection(): Section
    {
        return Section::make('Why Us Section')
            ->collapsible()
            ->schema([
                TextInput::make('why.title')
                    ->label('Title')
                    ->required(),
                TextInput::make('why.description')
                    ->label('Description')
                    ->required(),
                Repeater::make('why.advantages')
                    ->label('Advantages')
                    ->grid(2)
                    ->minItems(1)
                    ->schema([
                        Group::make([
                            GlobalFormComponents::icon('icon')
                                ->label('Icon'),
                            ColorPicker::make('color')
                                ->label('Color')
                                ->required()
                                ->helperText('Select a color for the Advantage.'),
                        ])->columns(2),
                        TextInput::make('title')
                            ->label('Title')
                            ->required(),
                        Textarea::make('description')
                            ->label('Description')
                            ->required()
                            ->columnSpanFull(),
                        Repeater::make('sub')
                            ->label('Sub Advantages')
                            ->columnSpanFull()
                            ->grid(2)
                            ->schema([
                                TextInput::make('description')
                                    ->label('Description')
                                    ->required(),
                            ])
                    ])
            ]);
    }

    protected function procedureSection(): Section
    {
        return Section::make('How to Order Section')
            ->collapsible()
            ->schema([
                TextInput::make('procedure.title')
                    ->label('Title')
                    ->required(),
                TextInput::make('procedure.description')
                    ->label('Description')
                    ->required(),
                Repeater::make('procedure.steps')
                    ->label('Steps')
                    ->grid(2)
                    ->schema([
                        Group::make([
                            GlobalFormComponents::icon('icon')
                                ->label('Icon Picker')
                                ->required()
                                ->helperText('Select an icon for the Step.'),
                            ColorPicker::make('color')
                                ->label('Color')
                                ->required()
                                ->helperText('Select a color for the Step.'),
                        ])->columns(2),
                        TextInput::make('title')
                            ->label('Title')
                            ->required(),
                        Textarea::make('description')
                            ->label('Description')
                            ->required(),
                    ]),
                Repeater::make('procedure.guarantees')
                    ->label('Guarantees')
                    ->columns(2)
                    ->schema([
                        GlobalFormComponents::icon('icon')
                            ->label('Icon Picker')
                            ->required()
                            ->helperText('Select an icon for the Guarantee.'),
                        TextInput::make('label')
                            ->label('Label')
                            ->required(),
                    ])
            ]);
    }

    protected function ctaSection(): Section
    {
        return Section::make('CTA Section')
            ->collapsible()
            ->schema([
                GlobalFormComponents::icon('cta.icon')
                    ->label('icon'),
                TextInput::make('cta.title')
                    ->label('Title')
                    ->required()
                    ->maxLength(120),
                Textarea::make('cta.description')
                    ->label('Description')
                    ->required()
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
                ->action('save'),
        ];
    }

    public function save(): void
    {
        Content::saveAndCache($this->pageKey, $this->data);

        Notification::make()
            ->title('Service page saved')
            ->success()
            ->send();
    }
}
