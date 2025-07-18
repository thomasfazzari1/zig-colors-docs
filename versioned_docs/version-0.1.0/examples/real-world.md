---
title: Real-World Examples
sidebar_position: 3
---

# Real World Examples

Complete, practical examples showing how to use zig-colors in real applications.

## Logger

A full-featured logger with different log levels and formatting:

```zig
const std = @import("std");
const colors = @import("zig-colors");

pub const LogLevel = enum {
    debug,
    info,
    warn,
    err,
    fatal,
};

pub const Logger = struct {
    level: LogLevel = .info,
    show_timestamp: bool = true,
    show_location: bool = false,

    const Self = @This();

    pub fn init() Self {
        colors.init();
        return Self{};
    }

    pub fn deinit() void {
        colors.deinit();
    }

    pub fn debug(self: Self, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) > @intFromEnum(LogLevel.debug)) return;
        self.log(.debug, fmt, args);
    }

    pub fn info(self: Self, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) > @intFromEnum(LogLevel.info)) return;
        self.log(.info, fmt, args);
    }

    pub fn warn(self: Self, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) > @intFromEnum(LogLevel.warn)) return;
        self.log(.warn, fmt, args);
    }

    pub fn err(self: Self, comptime fmt: []const u8, args: anytype) void {
        if (@intFromEnum(self.level) > @intFromEnum(LogLevel.err)) return;
        self.log(.err, fmt, args);
    }

    pub fn fatal(self: Self, comptime fmt: []const u8, args: anytype) void {
        self.log(.fatal, fmt, args);
        std.process.exit(1);
    }

    fn log(self: Self, level: LogLevel, comptime fmt: []const u8, args: anytype) void {
        const stdout = std.io.getStdOut().writer();

        // Timestamp
        if (self.show_timestamp) {
            const timestamp = std.time.timestamp();
            const style = colors.dim;
            stdout.print("{} ", .{style.call("[2024-01-15 10:30:45]")}) catch return;
        }

        // Level badge
        const level_style = switch (level) {
            .debug => colors.magenta,
            .info => colors.blue,
            .warn => colors.yellow,
            .err => colors.red,
            .fatal => colors.white.bgRed().bold(),
        };

        const level_text = switch (level) {
            .debug => "DEBUG",
            .info => " INFO",
            .warn => " WARN",
            .err => "ERROR",
            .fatal => "FATAL",
        };

        stdout.print("{} ", .{level_style.call(level_text)}) catch return;

        // Message
        stdout.print(fmt ++ "\n", args) catch return;
    }
};

// Usage example
pub fn main() !void {
    var logger = Logger.init();
    defer logger.deinit();

    logger.debug("Starting application", .{});
    logger.info("Server listening on port {d}", .{8080});
    logger.warn("Cache miss for key: {s}", .{"user:123"});
    logger.err("Failed to connect to database: {s}", .{"timeout"});
}
```

## Progress Bar

An animated progress bar with color transitions:

```zig
const std = @import("std");
const colors = @import("zig-colors");

pub const ProgressBar = struct {
    total: usize,
    current: usize = 0,
    width: usize = 40,
    show_percentage: bool = true,
    show_time: bool = true,
    start_time: i64,

    const Self = @This();

    pub fn init(total: usize) Self {
        return Self{
            .total = total,
            .start_time = std.time.milliTimestamp(),
        };
    }

    pub fn update(self: *Self, current: usize) void {
        self.current = current;
        self.draw();
    }

    pub fn increment(self: *Self) void {
        self.current += 1;
        self.draw();
    }

    pub fn finish(self: *Self) void {
        self.current = self.total;
        self.draw();
        std.debug.print("\n", .{});
    }

    fn draw(self: Self) void {
        const stdout = std.io.getStdOut().writer();

        // Calculate progress
        const progress = @as(f32, @floatFromInt(self.current)) / @as(f32, @floatFromInt(self.total));
        const filled = @as(usize, @intFromFloat(progress * @as(f32, @floatFromInt(self.width))));

        // Clear line
        stdout.writeAll("\r") catch return;

        // Draw bar
        stdout.writeAll("[") catch return;

        var i: usize = 0;
        while (i < self.width) : (i += 1) {
            if (i < filled) {
                // Color based on progress
                const style = if (progress < 0.33)
                    colors.red
                else if (progress < 0.66)
                    colors.yellow
                else
                    colors.green;

                stdout.print("{}", .{style.call("█")}) catch return;
            } else {
                stdout.print("{}", .{colors.dim.call("░")}) catch return;
            }
        }

        stdout.writeAll("]") catch return;

        // Percentage
        if (self.show_percentage) {
            const percent = @as(u8, @intFromFloat(progress * 100));
            stdout.print(" {}%", .{percent}) catch return;
        }

        // Time elapsed
        if (self.show_time) {
            const elapsed = std.time.milliTimestamp() - self.start_time;
            const seconds = @divTrunc(elapsed, 1000);
            stdout.print(" {}", .{colors.dim.call(std.fmt.comptimePrint(" [{d}s]", .{seconds}))}) catch return;
        }

        // Flush output
        stdout.writeAll(" ") catch return;
    }
};

// Usage
pub fn processFiles(files: []const []const u8) !void {
    var progress = ProgressBar.init(files.len);

    for (files) |file| {
        // Process file...
        std.time.sleep(100 * std.time.ns_per_ms); // Simulate work
        progress.increment();
    }

    progress.finish();
}
```

## Interactive Menu

A colorful interactive menu system:

```zig
const std = @import("std");
const colors = @import("zig-colors");

pub const MenuItem = struct {
    label: []const u8,
    action: *const fn () void,
    description: ?[]const u8 = null,
};

pub const Menu = struct {
    title: []const u8,
    items: []const MenuItem,
    selected: usize = 0,

    const Self = @This();

    pub fn draw(self: Self) void {
        const stdout = std.io.getStdOut().writer();

        // Clear screen (platform-specific)
        stdout.writeAll("\x1b[2J\x1b[H") catch return;

        // Title
        const title_style = colors.bold.underline();
        stdout.print("\n  {}\n\n", .{title_style.call(self.title)}) catch return;

        // Menu items
        for (self.items, 0..) |item, i| {
            if (i == self.selected) {
                // Highlighted item
                stdout.print("{} ", .{colors.cyan.call("▶")}) catch return;
                stdout.print("{}", .{colors.cyan.bold().call(item.label)}) catch return;

                if (item.description) |desc| {
                    stdout.print("\n    {}", .{colors.dim.call(desc)}) catch return;
                }
            } else {
                // Normal item
                stdout.print("  {}", .{item.label}) catch return;
            }
            stdout.print("\n", .{}) catch return;
        }

        // Instructions
        stdout.print("\n", .{}) catch return;
        stdout.print("{} ", .{colors.dim.call("Use ↑/↓ to navigate, Enter to select, Q to quit")}) catch return;
    }

    pub fn moveUp(self: *Self) void {
        if (self.selected > 0) {
            self.selected -= 1;
        } else {
            self.selected = self.items.len - 1;
        }
    }

    pub fn moveDown(self: *Self) void {
        self.selected = (self.selected + 1) % self.items.len;
    }

    pub fn select(self: Self) void {
        self.items[self.selected].action();
    }
};

// Usage
fn action1() void {
    std.debug.print("\n{}\n", .{colors.green.call("Starting backup...")});
}

fn action2() void {
    std.debug.print("\n{}\n", .{colors.blue.call("Checking for updates...")});
}

fn action3() void {
    std.debug.print("\n{}\n", .{colors.yellow.call("Cleaning cache...")});
}

pub fn showMainMenu() void {
    const items = [_]MenuItem{
        .{ .label = "Backup Data", .action = action1, .description = "Create a full system backup" },
        .{ .label = "Check Updates", .action = action2, .description = "Check for software updates" },
        .{ .label = "Clean Cache", .action = action3, .description = "Remove temporary files" },
    };

    var menu = Menu{
        .title = "System Maintenance",
        .items = &items,
    };

    menu.draw();
    // Handle input loop here...
}
```

## Best Practices Summary

1. **Always initialize**: Call `colors.init()` at program start
2. **Check support**: Use `colors.isSupported()` for graceful degradation
3. **Create semantic styles**: Define meaningful style constants for consistency
4. **Handle errors**: Color operations can fail on write, handle appropriately
5. **Clean up**: Call `colors.deinit()` when done
6. **Test without colors**: Set `NO_COLOR=1` environment variable to test fallbacks

## Next Steps

- Review the [API Reference](../api/colors.md) for complete method documentation
