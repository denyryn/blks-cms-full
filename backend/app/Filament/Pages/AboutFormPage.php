<?php

namespace App\Filament\Pages;

use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Group;
use App\Models\Content;
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Guava\FilamentIconPicker\Forms\IconPicker;

class AboutFormPage extends Page implements HasForms
{
    use InteractsWithForms;

    public ?array $data = [];

    protected static string | \UnitEnum | null $navigationGroup = 'CMS';
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'About Page';
    protected static ?int $navigationSort = 4;
    public static bool $shouldRegisterNavigation = true;

    protected string $view = 'filament.pages.about-form-page';

    protected ?string $pageKey = 'about_page';

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
                $this->valueSection(),
                $this->recordSection(),
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
                Repeater::make('hero.achievements')
                    ->label('Achievements')
                    ->schema([
                        Group::make([
                            IconPicker::make('icon_picker')
                                ->sets(['lucide'])
                                ->label('Icon Picker')
                                ->required()
                                ->helperText('Select an icon for the achievement.'),
                            TextInput::make('number')
                                ->label('Number')
                                ->required()
                                ->maxLength(20)
                                ->helperText('Achievement number, e.g., 100+'),
                        ])->columns(2),
                        TextInput::make('label')
                            ->label('Label')
                            ->required()
                            ->maxLength(50)
                            ->helperText('Achievement label, e.g., Projects Completed'),
                        TextInput::make('description')
                            ->label('Description')
                            ->required()
                            ->maxLength(100)
                            ->helperText('Short description of the achievement.'),
                    ])
                    ->minItems(1)
                    ->maxItems(10)
                    ->columnSpanFull()
                    ->createItemButtonLabel('Add Achievement'),
            ]);
    }

    protected function valueSection(): Section
    {
        return Section::make('Value Section')
            ->collapsible()
            ->schema([
                Repeater::make('values')
                    ->label('Values')
                    ->schema([
                        IconPicker::make('icon')
                            ->sets(['lucide'])
                            ->label('Icon')
                            ->required()
                            ->helperText('Select an icon for the value.'),
                        TextInput::make('label')
                            ->label('Label')
                            ->required()
                            ->maxLength(50)
                            ->helperText('Value label, e.g., Feature A'),
                        TextInput::make('description')
                            ->label('Description')
                            ->required()
                            ->maxLength(100)
                            ->helperText('Short description of the value.'),
                        Group::make([
                            ColorPicker::make('color')
                                ->helperText('Color for card value')
                        ])
                    ])
            ]);
    }

    protected function recordSection(): Section
    {
        return Section::make('Record Section')
            ->collapsible()
            ->schema([
                TextInput::make('record.title')
                    ->label('Title')
                    ->required(),
                Textarea::make('record.description')
                    ->label('Description')
                    ->required(),
                Repeater::make('record.milestones')
                    ->label('Milestones')
                    ->schema([
                        TextInput::make('year')
                            ->label('Year')
                            ->type('number')
                            ->required(),
                        Group::make([
                            TextInput::make('title')
                                ->label('Title')
                                ->required(),
                            TextInput::make('description')
                                ->label('Description')
                                ->required()
                        ])
                    ])->columns(2)
            ]);
    }

    protected function ctaSection(): Section
    {
        return Section::make('CTA Section')
            ->collapsible()
            ->schema([
                IconPicker::make('cta.icon')
                    ->sets(['lucide'])
                    ->label('icon'),
                TextInput::make('cta.title')
                    ->label('title')
                    ->required(),
                Textarea::make('cta.description')
                    ->label('description')
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
            ->title('About page saved')
            ->success()
            ->send();
    }
}
