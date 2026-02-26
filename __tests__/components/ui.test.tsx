import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders button with text', () => {
      const { getByText } = render(<Button>Click Me</Button>);
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('calls onPress when clicked', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button onPress={onPress}>Click</Button>);
      
      fireEvent.press(getByText('Click'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('disables button when disabled prop is true', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button disabled onPress={onPress}>Disabled</Button>);
      
      fireEvent.press(getByText('Disabled'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('shows loading state', () => {
      const { getByTestId } = render(<Button loading>Loading</Button>);
      expect(getByTestId('button-spinner')).toBeTruthy();
    });

    it('applies variant styles correctly', () => {
      const { getByText } = render(<Button variant="primary">Primary</Button>);
      const button = getByText('Primary').parent;
      expect(button?.props.style).toMatchObject(expect.objectContaining({ backgroundColor: expect.any(String) }));
    });
  });

  describe('Input', () => {
    it('renders input with placeholder', () => {
      const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('calls onChange when text changes', () => {
      const onChange = jest.fn();
      const { getByPlaceholderText } = render(<Input placeholder="Test" onChangeText={onChange} />);
      
      fireEvent.changeText(getByPlaceholderText('Test'), 'New text');
      expect(onChange).toHaveBeenCalledWith('New text');
    });

    it('displays error message', () => {
      const { getByText } = render(<Input error="Invalid input" />);
      expect(getByText('Invalid input')).toBeTruthy();
    });

    it('applies error styles when error exists', () => {
      const { getByPlaceholderText } = render(<Input placeholder="Test" error="Error" />);
      const input = getByPlaceholderText('Test');
      expect(input.props.style).toMatchObject(expect.objectContaining({ borderColor: expect.any(String) }));
    });

    it('renders with icon', () => {
      const Icon = () => null;
      const { getByTestId } = render(<Input icon={<Icon />} testID="input-with-icon" />);
      expect(getByTestId('input-with-icon')).toBeTruthy();
    });

    it('handles secure text entry', () => {
      const { getByPlaceholderText } = render(<Input placeholder="Password" secureTextEntry />);
      const input = getByPlaceholderText('Password');
      expect(input.props.secureTextEntry).toBe(true);
    });
  });
});
