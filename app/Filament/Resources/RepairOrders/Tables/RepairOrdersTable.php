<?php

namespace App\Filament\Resources\RepairOrders\Tables;

use App\Enums\Priority;
use App\Enums\RepairStatus;
use App\Models\RepairOrder;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

/**
 * Filament-convention coverage: enum badge columns via enum methods, a
 * domain action calling RepairOrder::complete() (a known caller for the
 * symbol_card hub), a route() URL action, and a scope-backed filter.
 */
class RepairOrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reference')
                    ->searchable(),
                TextColumn::make('customer.name')
                    ->searchable(),
                TextColumn::make('technician.name')
                    ->placeholder('Unassigned'),
                TextColumn::make('status')
                    ->badge()
                    ->formatStateUsing(fn (RepairStatus $state): string => $state->label()),
                TextColumn::make('priority')
                    ->badge()
                    ->sortable(query: fn (Builder $query, string $direction): Builder => $query->orderBy('priority', $direction)),
                TextColumn::make('subtotal_cents')
                    ->label('Subtotal'),
                TextColumn::make('opened_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('completed_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Filter::make('rush')
                    ->label('Rush only')
                    ->query(fn (Builder $query): Builder => $query->rush()),
                Filter::make('open')
                    ->label('Open only')
                    ->query(fn (Builder $query): Builder => $query->open()),
            ])
            ->recordActions([
                Action::make('complete')
                    ->label('Complete')
                    ->requiresConfirmation()
                    ->visible(fn (RepairOrder $record): bool => in_array(RepairStatus::Completed, $record->status->transitionsTo(), true))
                    ->action(fn (RepairOrder $record) => $record->complete(auth()->user()->name ?? 'panel')),
                Action::make('report')
                    ->label('Report')
                    ->url(fn (RepairOrder $record): string => route('report.show', $record))
                    ->openUrlInNewTab(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('opened_at', 'desc')
            ->modifyQueryUsing(fn (Builder $query): Builder => $query->with(['customer', 'technician']));
    }
}
