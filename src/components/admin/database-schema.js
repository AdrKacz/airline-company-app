const databaseSchema = {
    'user': {
        'fields': [
            ['email', 'text'],
            ['password-hash', 'text'],
            ['admin', 'bool']
        ]
    },
    'airport': {
        'fields': [
            ['name', 'text'],
            ['code', 'text'],
        ]
    },
    'airplane': {
        'fields': [
            ['number', 'number'],
            ['type', 'text'],
        ]
    },
    'employee': {
        'fields': [
            ['security-number', 'number'],
            ['surname', 'text'],
            ['name', 'text'],
            ['address', 'text'],
            ['salary', 'number'],
            ['user-id', '$user$email'],
        ]
    },
    'consumer': {
        'fields': [
            ['number', 'number'],
            ['surname', 'text'],
            ['name', 'text'],
            ['user-id', '$user$email'],
        ]
    },

    'connection': {
        'fields': [
            ['departure-airport-id', '$airport$name'],
            ['arrival-airport-id', '$airport$name'],
        ]
    },
    'pilot': {
        'fields': [
            ['employee-id', '$employee$name.surname'],
            ['license-number', 'text'],
        ]
    },
    'crew-member': {
        'fields': [
            ['employee-id', '$employee$name.surname'],
            ['role', 'text'],
        ]
    },

    'flight': {
        'fields': [
            ['from', 'date'],
            ['to', 'date'],
            ['number', 'number'],
            ['connection-id', '$connection$id'],
            ['airplane-id', '$airplane$number'],
            ['departure-day', 'text'],
            ['arrival-day', 'text'],
            ['departure-time', 'time'],
            ['arrival-time', 'time'],
        ]
    },
    
    'departure': {
        'fields': [
            ['flight-id', '$flight$from.to'],
            ['date', 'date'],
            ['pilot-id', '$pilot$name.surname'],
            ['optional-pilot-id', '$pilot$name.surname'],
            ['first-crew-member-id', '$crew-member$name.surname'],
            ['second-crew-member-id', '$crew-member$name.surname'],
            ['number-of-empty-seat', 'number'],
            ['number-of-reserved-seat', 'number'],
        ]
    },

    'ticket': {
        'fields': [
            ['number', 'number'],
            ['date-time-of-issue', 'datetime-local'],
            ['price', 'number'],
            ['departure-id', '$departure$date'],
            ['consumer-id', '$consumer$date'],
        ]
    },
}

export default databaseSchema;