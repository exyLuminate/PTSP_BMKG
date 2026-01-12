<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaqMessage extends Model
{
    protected $fillable = ['user_name', 'email', 'question', 'answer', 'is_published'];
}
