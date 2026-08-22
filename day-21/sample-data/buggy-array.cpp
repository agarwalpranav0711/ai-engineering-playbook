#include <iostream>
using namespace std;

// Calculates sum of array elements
int sum(int arr[], int n) {
    int result = 0;

    // BUG: Loop condition 'i <= n' goes out of bounds at index 'n'
    for(int i = 0; i <= n; i++) {
        result += arr[i];
    }

    return result;
}

int main() {
    int nums[] = {10, 20, 30, 40, 50};
    int total = sum(nums, 5);
    cout << "Total: " << total << endl;
    return 0;
}
