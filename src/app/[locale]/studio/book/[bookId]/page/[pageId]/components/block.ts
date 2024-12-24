import React, { useState, useEffect } from 'react';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css'; // Стили Draft.js