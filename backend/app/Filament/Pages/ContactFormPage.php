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

class ContactFormPage extends Page implements HasForms
{
    use InteractsWithForms;

    public array $data = [];

    protected static ?string $navigationGroup = 'CMS';
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Contact Page';
    protected static ?int $navigationSort = 4;
    public static bool $shouldRegisterNavigation = true;

    protected static string $view = 'filament.pages.contact-form-page';

    protected ?string $pageKey = 'contact_page';

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
                $this->informationSection(),
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
                    ->required()
                    ->helperText('Short description shown to visitors.'),
            ]);
    }

    protected function informationSection(): Section
    {
        return Section::make('Information Section')
            ->collapsible()
            ->schema([
                TextInput::make('information.title')
                    ->label('Title')
                    ->required()
                    ->maxLength(120)
                    ->helperText('Big heading shown to visitors.'),
                Textarea::make('information.description')
                    ->label('Description')
                    ->required()
                    ->helperText('Short description shown to visitors.'),
                Repeater::make('information.items')
                    ->label('Information Items')
                    ->grid(2)
                    ->schema([
                        Group::make([
                            GlobalFormComponents::icon('icon')
                                ->label('Icon')
                                ->required()
                                ->helperText('Icon class for the information item.'),
                            GlobalFormComponents::color('color'),
                        ])->columns(2),

                        TextInput::make('label')
                            ->label('Label')
                            ->required()
                            ->maxLength(50)
                            ->helperText('Label for the information item.'),
                        TextInput::make('value')
                            ->label('Value')
                            ->required()
                            ->maxLength(100)
                            ->helperText('Value for the information item.'),
                        TextInput::make('description')
                            ->label('Description')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Short description for the information item.'),
                    ])
                    ->minItems(1)
                    ->columnSpanFull(),
            ]);
    }

    protected function ctaSection(): Section
    {
        return Section::make('Call To Action Section')
            ->collapsible()
            ->schema([
                IconPicker::make('cta.icon')
                    ->sets(['lucide'])
                    ->label('Icon')
                    ->required()
                    ->helperText('Icon shown in the CTA section.')
                    ->columns(3),
                TextInput::make('cta.title')
                    ->label('Title')
                    ->required()
                    ->maxLength(120)
                    ->helperText('Big heading shown to visitors.'),
                Textarea::make('cta.description')
                    ->label('Description')
                    ->required()
                    ->helperText('Short description shown to visitors.'),
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
            ->title('Contact page saved')
            ->success()
            ->send();
    }
}
