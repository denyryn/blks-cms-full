<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Content extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['key', 'value'];
    protected $casts = ['value' => 'array'];

    public static function allCached(): array
    {
        return Cache::rememberForever('contents', function () {
            return self::pluck('value', 'key')->toArray();
        });
    }

    public static function getCached(string $key): ?array
    {
        return Cache::rememberForever("content:{$key}", function () use ($key) {
            return optional(self::find($key))->value;
        });
    }

    public static function updateContent(string $key, array $value): self
    {
        $content = self::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget('contents');
        self::allCached(); // repopulate
        return $content;
    }

    public static function saveAndCache(string $key, array $value): self
    {
        $content = self::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("content:{$key}");
        Cache::forever("content:{$key}", $value);
        return $content;
    }
}
