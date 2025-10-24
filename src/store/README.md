# Redux State Management

This project uses Redux Toolkit for centralized state management.

## Store Structure

### Slices

1. **Language Slice** (`slices/languageSlice.ts`)
   - Manages application language (Hebrew/English)
   - Contains all translations
   - Automatically updates document direction and language attributes
   - Selectors:
     - `getLanguage(state)` - Get current language
     - `getTranslation(state, section, key)` - Get translated text

2. **Booking Slice** (`slices/bookingSlice.ts`)
   - Manages booking form state
   - Contains form data, tour date, and submission status
   - Actions:
     - `updateFormField({ field, value })` - Update a form field
     - `setTourDate(date)` - Set tour date
     - `setIsSubmitting(boolean)` - Set submission status
     - `resetBookingForm()` - Reset all booking data

3. **Tour Slice** (`slices/tourSlice.ts`)
   - Manages tour preferences
   - Contains tour type and preselected destinations
   - Actions:
     - `setTourType(type)` - Set tour type
     - `setPreselectedDestinations(destinations)` - Set destinations
     - `resetTourPreferences()` - Reset tour preferences

## Usage

### Basic Usage

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLanguage, getLanguage } from '@/store/slices/languageSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector(getLanguage);
  
  const handleLanguageChange = (lang: 'he' | 'en') => {
    dispatch(setLanguage(lang));
  };
  
  return <div>Current language: {language}</div>;
};
```

### Accessing State

Always use the typed hooks from `@/store/hooks`:
- `useAppDispatch()` - Get dispatch function
- `useAppSelector(selector)` - Select state

### Updating State

Dispatch actions from the appropriate slice:

```typescript
// Update booking form
dispatch(updateFormField({ field: 'customer_name', value: 'John Doe' }));

// Set tour preferences
dispatch(setTourType('vip'));
dispatch(setPreselectedDestinations(['destination1', 'destination2']));
```

## Benefits of Redux in This Project

1. **Centralized State**: All shared state is in one place
2. **Type Safety**: Full TypeScript support with typed hooks
3. **Predictable Updates**: State changes are explicit through actions
4. **Easy Debugging**: Redux DevTools support
5. **Separation of Concerns**: Business logic separated from UI components
