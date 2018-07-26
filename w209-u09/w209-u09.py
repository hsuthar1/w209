import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 3*np.pi, 500)
lin = plt.plot(x, np.sin(x**2))
title = plt.title('Simple Chirp')

plt.savefig("test.png")