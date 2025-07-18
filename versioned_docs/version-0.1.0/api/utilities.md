---
title: Utilities
sidebar_position: 5
---

# Utilities API Reference

Documentation for utility functions, initialization, and configuration options.

## Initialization Functions

### init

```zig
pub fn init() void
```

Initializes color support detection. Should be called at program startup.

**Effects:**

- Detects terminal color capabilities
- Sets the global color level
- Enables color output

**Usage:**

```zig
pub fn main() !void {
    colors.init();
    defer colors.deinit();

    // Your colorful code here
}
```

### deinit

```zig
pub fn deinit() void
```

Cleanup function that resets terminal styles. Should be called at program exit.

**Effects:**

- Sends reset sequence to terminal
- Ensures no styles persist after program exit

## Detection Functions

### isSupported

```zig
pub fn isSupported() bool
```

Checks if colors are supported in the current environment.

**Returns:** `true` if colors are enabled and supported, `false` otherwise

**Usage:**

```zig
if (colors.isSupported()) {
    std.debug.print("{}\n", .{colors.green.call("✓ Colors supported!")});
} else {
    std.debug.print("✓ Colors not supported\n", .{});
}
```

### getLevel

```zig
pub fn getLevel() Level
```

Returns the current color support level.

**Returns:** `Level` enum value indicating color support

**Usage:**

```zig
const level = colors.getLevel();
switch (level) {
    .none => std.debug.print("No color support\n", .{}),
    .basic => std.debug.print("16 colors\n", .{}),
    .ansi256 => std.debug.print("256 colors\n", .{}),
    .truecolor => std.debug.print("16M colors (RGB)\n", .{}),
}
```

## Configuration Functions

### setLevel

```zig
pub fn setLevel(level: Level) void
```

Manually sets the color support level.

**Parameters:**

- `level`: The color level to set

**Usage:**

```zig
// Force basic 16-color mode
colors.setLevel(.basic);

// Disable colors entirely
colors.setLevel(.none);

// Force truecolor mode
colors.setLevel(.truecolor);
```

### setEnabled

```zig
pub fn setEnabled(enable: bool) void
```

Enables or disables color output globally.

**Parameters:**

- `enable`: `true` to enable colors, `false` to disable

**Usage:**

```zig
// Disable colors for piped output
if (!std.io.getStdOut().isTty()) {
    colors.setEnabled(false);
}

// Disable colors based on user preference
if (args.no_color) {
    colors.setEnabled(false);
}
```

## Utility Functions

### print

```zig
pub fn print(style: anytype, comptime fmt: []const u8, args: anytype) !void
```

Convenience function for printing styled text with formatting.

**Parameters:**

- `style`: Either a `Color` or `Style` to apply
- `fmt`: Format string (comptime)
- `args`: Format arguments

**Usage:**

```zig
// With color
try colors.print(.red, "Error: {s}\n", .{error_msg});

// With style
try colors.print(colors.green.bold(), "Success: {} items processed\n", .{count});
```

### strip

```zig
pub fn strip(text: []const u8, allocator: std.mem.Allocator) ![]u8
```

Removes all ANSI escape codes from text.

**Parameters:**

- `text`: Text potentially containing ANSI codes
- `allocator`: Allocator for result string

**Returns:** New string with ANSI codes removed

**Usage:**

```zig
const styled = colors.red.bold().call("Error!");
const plain = try colors.strip(std.fmt.allocPrint(allocator, "{}", .{styled}), allocator);
defer allocator.free(plain);
// plain = "Error!"
```

## Environment Variables

zig-colors respects standard environment variables:

### NO_COLOR

When set (to any value), disables all color output:

```bash
NO_COLOR=1 ./my-program
```

### COLORTERM

Indicates truecolor support:

- `truecolor` or `24bit`: Full RGB support

```bash
COLORTERM=truecolor ./my-program
```

### TERM

Terminal type detection:

- Contains `256color`: 256 color support
- Contains `truecolor`: RGB support
- Equals `dumb`: No color support

## Platform-Specific Behavior

### Windows

```zig
// Automatically handled by zig-colors
if (builtin.os.tag == .windows) {
    // Windows 10+ supports ANSI by default
    // Older versions may need special handling
}
```

### Unix-like Systems

```zig
// TTY detection
if (!std.io.getStdOut().isTty()) {
    // Output is piped or redirected
    colors.setEnabled(false);
}
```

## Advanced Configuration

### Custom Detection

```zig
pub fn customColorDetection() void {
    const allocator = std.heap.page_allocator;

    // Check custom environment variable
    if (std.process.getEnvVarOwned(allocator, "MY_APP_COLORS")) |value| {
        defer allocator.free(value);

        if (std.mem.eql(u8, value, "none")) {
            colors.setLevel(.none);
        } else if (std.mem.eql(u8, value, "basic")) {
            colors.setLevel(.basic);
        } else if (std.mem.eql(u8, value, "full")) {
            colors.setLevel(.truecolor);
        }
    } else |_| {
        // Use default detection
        colors.init();
    }
}
```

### Configuration Struct

```zig
const ColorConfig = struct {
    enabled: bool = true,
    level: colors.Level = .basic,
    respect_no_color: bool = true,
    force_color: bool = false,

    pub fn apply(self: ColorConfig) void {
        if (self.force_color) {
            colors.setEnabled(true);
            colors.setLevel(self.level);
        } else if (self.respect_no_color) {
            colors.init();  // Respects NO_COLOR
            if (self.enabled) {
                colors.setLevel(@min(colors.getLevel(), self.level));
            } else {
                colors.setEnabled(false);
            }
        } else {
            colors.setEnabled(self.enabled);
            if (self.enabled) {
                colors.setLevel(self.level);
            }
        }
    }
};
```

## Performance Tips

### Pre-compute Styles

```zig
// Instead of creating styles repeatedly
for (items) |item| {
    std.debug.print("{}\n", .{colors.red.bold().call(item)});
}

// Pre-compute once
const style = colors.red.bold();
for (items) |item| {
    std.debug.print("{}\n", .{style.call(item)});
}
```

### Conditional Styling

```zig
// Check once, not in loops
const use_color = colors.isSupported();
const error_style = if (use_color) colors.red.bold() else colors.Style{};

for (errors) |err| {
    std.debug.print("{}\n", .{error_style.call(err)});
}
```

### Batch Operations

```zig
// Buffer output for better performance
var buf: [4096]u8 = undefined;
var stream = std.io.fixedBufferStream(&buf);
const writer = stream.writer();

// Write styled content to buffer
try writer.print("{}", .{colors.green.call("Success")});
try writer.print(" - ", .{});
try writer.print("{}", .{colors.dim.call("Operation complete")});

// Single write to stdout
try std.io.getStdOut().writeAll(stream.getWritten());
```

## Testing

### Testing with Colors

```zig
test "color output" {
    // Save current state
    const original_level = colors.getLevel();
    defer colors.setLevel(original_level);

    // Test with colors disabled
    colors.setLevel(.none);
    // ... test plain output ...

    // Test with basic colors
    colors.setLevel(.basic);
    // ... test basic color output ...

    // Test with full colors
    colors.setLevel(.truecolor);
    // ... test RGB output ...
}
```

### Mock Terminal

```zig
test "terminal detection" {
    // Test NO_COLOR environment
    try std.testing.expect(colors.isSupported() == expected);

    // Test different terminal types
    colors.setLevel(.basic);
    try std.testing.expect(colors.getLevel() == .basic);
}
```

## Troubleshooting

### Common Issues

1. **Colors not showing**: Check terminal support and environment variables
2. **Wrong colors**: Terminal may not support requested level
3. **Persistent styles**: Ensure `deinit()` is called
4. **Performance issues**: Pre-compute styles, batch operations

### Debug Output

```zig
pub fn debugColorSupport() void {
    std.debug.print("Color Support Debug:\n", .{});
    std.debug.print("  Enabled: {}\n", .{colors.isSupported()});
    std.debug.print("  Level: {}\n", .{colors.getLevel()});

    const allocator = std.heap.page_allocator;
    if (std.process.getEnvVarOwned(allocator, "TERM")) |term| {
        defer allocator.free(term);
        std.debug.print("  TERM: {s}\n", .{term});
    } else |_| {}

    if (std.process.getEnvVarOwned(allocator, "COLORTERM")) |ct| {
        defer allocator.free(ct);
        std.debug.print("  COLORTERM: {s}\n", .{ct});
    } else |_| {}

    if (std.process.getEnvVarOwned(allocator, "NO_COLOR")) |_| {
        std.debug.print("  NO_COLOR: set\n", .{});
    } else |_| {}
}
```

## See Also

- [Getting Started](../getting-started.md) - Initial setup guide
- [Colors API](colors.md) - Color functions
- [Styles API](styles.md) - Text formatting
- [Examples](../examples/basic-usage.md) - Practical examples
