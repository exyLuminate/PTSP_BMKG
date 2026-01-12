<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataCatalog extends Model
{
    protected $fillable = ['info_type', 'unit', 'price'];

    public function requests()
    {
        return $this->hasMany(Request::class);
    }
}
