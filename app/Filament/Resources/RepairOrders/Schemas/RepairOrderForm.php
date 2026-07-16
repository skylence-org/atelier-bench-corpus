<?php

namespace App\Filament\Resources\RepairOrders\Schemas;

use App\Enums\Priority;
use App\Enums\RepairStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RepairOrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('reference')
                    ->required(),
                Select::make('customer_id')
                    ->relationship('customer', 'name')
                    ->required(),
                Select::make('device_id')
                    ->relationship('device', 'id')
                    ->required(),
                Select::make('technician_id')
                    ->relationship('technician', 'name'),
                Select::make('status')
                    ->options(RepairStatus::class)
                    ->default('received')
                    ->required(),
                Select::make('priority')
                    ->options(Priority::class)
                    ->default('normal')
                    ->required(),
                TextInput::make('subtotal_cents')
                    ->required()
                    ->numeric()
                    ->default(0),
                DateTimePicker::make('opened_at')
                    ->required(),
                DateTimePicker::make('completed_at'),
            ]);
    }
}
