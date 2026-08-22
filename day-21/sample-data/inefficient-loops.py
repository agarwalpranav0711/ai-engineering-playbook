# Inefficient pair sum calculation with O(n^2) time complexity

def print_all_pairs(arr):
    n = len(arr)
    # PERFORMANCE ISSUE: Nested loop causes quadratic O(n^2) time complexity
    for i in range(n):
        for j in range(n):
            print(f"Pair ({arr[i]}, {arr[j]}) -> Sum: {arr[i] + arr[j]}")

def find_duplicates(nums):
    dups = []
    # QUALITY ISSUE: Inefficient list searching inside nested loop
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j] and nums[i] not in dups:
                dups.append(nums[i])
    return dups
