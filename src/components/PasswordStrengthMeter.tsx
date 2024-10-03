import React from 'react'

interface PasswordStrengthMeterProps {
  password: string
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const calculateStrength = (password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (password.match(/[a-z]+/)) strength += 1
    if (password.match(/[A-Z]+/)) strength += 1
    if (password.match(/[0-9]+/)) strength += 1
    if (password.match(/[$@#&!]+/)) strength += 1
    return strength
  }

  const strength = calculateStrength(password)

  const getColor = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return 'bg-red-500'
      case 2:
        return 'bg-orange-500'
      case 3:
        return 'bg-yellow-500'
      case 4:
        return 'bg-blue-500'
      case 5:
        return 'bg-green-500'
      default:
        return 'bg-gray-200'
    }
  }

  const getLabel = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak'
      case 2:
        return 'Weak'
      case 3:
        return 'Medium'
      case 4:
        return 'Strong'
      case 5:
        return 'Very Strong'
      default:
        return ''
    }
  }

  return (
    <div className="mt-2">
      <div className="flex mb-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`h-2 w-1/5 ${index <= strength ? getColor(strength) : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className={`text-sm ${getColor(strength).replace('bg-', 'text-')}`}>
        {getLabel(strength)}
      </p>
    </div>
  )
}

export default PasswordStrengthMeter