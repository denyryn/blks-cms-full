<?php

namespace App\Filament\Pages;

use App\Models\Content;
use Filament\Actions\Action;
use Filament\Forms\Components\ColorPicker;
use App\Filament\Components\GlobalFormComponents;
use Filament\Forms\Components\Group;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Guava\FilamentIconPicker\Forms\IconPicker;

class AboutFormPage extends Page implements HasForms
{
    use InteractsWithForms;

    public array $data = [];

    protected static ?string $navigationGroup = 'CMS';
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'About Page';
    protected static ?int $navigationSort = 2;
    public static bool $shouldRegisterNavigation = true;

    protected static string $view = 'filament.pages.about-form-page';

    protected ?string $pageKey = 'about_page';

    public function mount(): void
    {
        $this->data = Content::getCached($this->pageKey) ?? [];
        $this->form->fill($this->data); // preload here if you store settings
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
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
                    ->grid(2)
                    ->minItems(1)
                    ->maxItems(10)
                    ->createItemButtonLabel('Add Achievement')
                    ->schema([
                        Group::make([
                            GlobalFormComponents::icon('icon_picker')
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
                    ]),
            ]);
    }

    protected function valueSection(): Section
    {
        return Section::make('Value Section')
            ->collapsible()
            ->schema([
                Repeater::make('values')
                    ->label('Values')
                    ->grid(2)
                    ->schema([
                        Group::make([
                            GlobalFormComponents::icon('icon')
                                ->label('Icon')
                                ->required()
                                ->helperText('Select an icon for the value.'),
                            GlobalFormComponents::color('color'),
                        ])->columns(2),

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
                    ->grid(2)
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
                    ])
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
