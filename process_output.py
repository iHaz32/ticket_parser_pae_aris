import json
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

# Read the JSON file
with open("output.json", "r") as f:
    data = json.load(f)

# Convert the data to a pandas DataFrame
df = pd.DataFrame(data)

# Total stats
total_sold = df['sold'].sum()
total_seats = df['total'].sum()
total_available = df['available'].sum()

print("\nTotal Summary:")
print(f"Total Sold: {total_sold}")
print(f"Total Seats: {total_seats}")
print(f"Total Available: {total_available}")

# Percentage of seats sold per gate
df['sold_percentage'] = (df['sold'] / df['total']) * 100

# Apply a custom black and yellow theme
sns.set_context("talk")
plt.style.use("dark_background")
colors = ["#FFCC00", "#1C1C1C"]  # Yellow and dark black

# Font properties
font_title = {'fontname': 'DejaVu Sans', 'fontsize': 16, 'color': 'yellow', 'fontweight': 'bold'}
font_label = {'fontname': 'DejaVu Sans', 'fontsize': 14, 'color': 'white'}
font_tick = {'fontname': 'DejaVu Sans', 'fontsize': 12, 'color': 'white'}
font_legend = {'fontsize': 12, 'color': 'white'}

# 1. Bar Plot: Sold vs Available by Gate
plt.figure(figsize=(12, 6))
bar_width = 0.4
index = np.arange(len(df['gate']))

plt.bar(index, df['sold'], bar_width, label="Sold", color=colors[0], edgecolor="black", linewidth=1.5)
plt.bar(index + bar_width, df['available'], bar_width, label="Available", color=colors[1], edgecolor="yellow", linewidth=1.5)

plt.xlabel("Gate", **font_label)
plt.ylabel("Number of Seats", **font_label)
plt.title("Sold vs Available Seats by Gate", **font_title)
plt.xticks(index + bar_width / 2, df['gate'], **font_tick)
plt.yticks(**font_tick)
plt.legend(facecolor="black", edgecolor="yellow", fontsize=12, loc='upper left')
plt.tight_layout()
plt.savefig("bar_plot_sold_available_black.png")
plt.show()

# 2. Pie Chart: Total distribution of Sold and Available
plt.figure(figsize=(8, 8))
labels = ['Sold', 'Available']
sizes = [total_sold, total_available]
colors = ['#FFCC00', '#1C1C1C']
explode = (0.1, 0)  # Explode the "Sold" slice

plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140, colors=colors, explode=explode,
        textprops={'color': "white", 'fontsize': 14})
plt.title("Total Seat Distribution", **font_title)
plt.savefig("pie_chart_total_black.png")
plt.show()

# 3. STEM Plot: Sold Percentage by Gate
plt.figure(figsize=(12, 6))
markerline, stemlines, baseline = plt.stem(df['gate'], df['sold_percentage'], linefmt="yellow", markerfmt="o", basefmt="black")
plt.setp(stemlines, 'linewidth', 2, color="yellow")
plt.setp(markerline, 'color', '#FFCC00', 'markersize', 10)

plt.xlabel("Gate", **font_label)
plt.ylabel("Sold Percentage (%)", **font_label)
plt.title("Sold Percentage by Gate", **font_title)
plt.xticks(df['gate'], **font_tick)
plt.yticks(**font_tick)
plt.ylim(0, 100)
plt.grid(visible=True, color="yellow", linestyle="--", alpha=0.3)
plt.tight_layout()
plt.savefig("stem_plot_sold_percentage_black.png")
plt.show()

# 4. Pie Chart: Gate Contribution to Sold Tickets (Absolute)
plt.figure(figsize=(8, 8))
labels = [f"Gate {gate}" for gate in df['gate']]
sizes = df['sold']
colors = sns.color_palette("husl", len(df))  # Generate a unique color for each gate

plt.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140, colors=colors,
        textprops={'color': "white", 'fontsize': 14})
plt.title("Gate Contribution to Sold Tickets (Absolute)", **font_title)
plt.savefig("bar_plot_gate_contribution_absolute.png")
plt.show()